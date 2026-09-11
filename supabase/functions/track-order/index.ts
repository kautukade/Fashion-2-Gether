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
    const { order_number, phone } = await req.json()

    // Validate required fields
    if (!order_number || !phone) {
      throw new Error('Order number and phone are required')
    }

    // Basic validation
    if (typeof order_number !== 'string' || order_number.length < 5) {
      throw new Error('Invalid order number')
    }

    if (typeof phone !== 'string' || phone.length < 10) {
      throw new Error('Invalid phone number')
    }

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Call the secure tracking function
    const { data: orderData, error: orderError } = await supabase.rpc('track_order_by_phone', {
      p_order_number: order_number,
      p_phone: phone,
    })

    if (orderError) {
      throw new Error(orderError.message)
    }

    if (!orderData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, order: orderData }),
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
