import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { items, shipping_address, payment_method, guest_email, guest_phone } = await req.json()

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Items array is required')
    }

    if (!shipping_address) {
      throw new Error('Shipping address is required')
    }

    if (!payment_method) {
      throw new Error('Payment method is required')
    }

    // Validate each item
    for (const item of items) {
      if (!item.variant_id || !item.quantity) {
        throw new Error('Each item must have variant_id and quantity')
      }
      if (item.quantity <= 0) {
        throw new Error('Quantity must be greater than 0')
      }
      if (item.quantity > 99) {
        throw new Error('Quantity cannot exceed 99')
      }
    }

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get authenticated user (if any)
    const authHeader = req.headers.get('Authorization')
    let authUserId = null
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      
      if (!authError && user) {
        authUserId = user.id
      }
    }

    // Determine customer_id
    let customerId = null
    
    if (authUserId) {
      // Authenticated user - find or create customer record
      const { data: existingCustomer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', authUserId)
        .single()

      if (customerError && customerError.code !== 'PGRST116') {
        throw new Error('Failed to lookup customer')
      }

      if (existingCustomer) {
        customerId = existingCustomer.id
      } else {
        // Create customer record for authenticated user
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert({
            user_id: authUserId,
            email: guest_email,
            phone: guest_phone,
            first_name: shipping_address.first_name,
            last_name: shipping_address.last_name,
          })
          .select('id')
          .single()

        if (createError) {
          throw new Error('Failed to create customer record')
        }

        customerId = newCustomer.id
      }
    }

    // Call the secure order creation function
    const { data: orderResult, error: orderError } = await supabase.rpc('create_secure_order', {
      p_guest_email: customerId ? null : guest_email,
      p_guest_phone: customerId ? null : guest_phone,
      p_customer_id: customerId,
      p_items: items,
      p_shipping_address: shipping_address,
      p_payment_method: payment_method,
    })

    if (orderError) {
      throw new Error(orderError.message)
    }

    return new Response(
      JSON.stringify({ success: true, order: orderResult }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
