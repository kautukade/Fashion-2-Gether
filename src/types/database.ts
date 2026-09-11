// Database types matching Supabase schema

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          status: 'active' | 'archived';
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          cover_url: string | null;
          is_active: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['collections']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['collections']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          category_id: string | null;
          collection_id: string | null;
          mrp: number;
          selling_price: number;
          fabric: string | null;
          fit: string | null;
          care_instructions: string | null;
          status: 'draft' | 'active' | 'archived';
          is_featured: boolean;
          is_trending: boolean;
          is_bestseller: boolean;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          color: string;
          size: string;
          price_override: number | null;
          stock_quantity: number;
          low_stock_threshold: number;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>;
      };
      product_media: {
        Row: {
          id: string;
          product_id: string;
          type: 'image' | 'video' | '360_frame';
          url: string;
          sort_order: number;
          alt_text: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['product_media']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['product_media']['Insert']>;
      };
      inventory_transactions: {
        Row: {
          id: string;
          variant_id: string;
          old_quantity: number;
          adjustment: number;
          new_quantity: number;
          reason: string;
          admin_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['inventory_transactions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['inventory_transactions']['Insert']>;
      };
      wishlists: {
        Row: {
          id: string;
          customer_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['wishlists']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['wishlists']['Insert']>;
      };
      wishlist_items: {
        Row: {
          id: string;
          wishlist_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['wishlist_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['wishlist_items']['Insert']>;
      };
      carts: {
        Row: {
          id: string;
          customer_id: string | null;
          session_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['carts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['carts']['Insert']>;
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          variant_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cart_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['cart_items']['Insert']>;
      };
      customers: {
        Row: {
          id: string;
          user_id: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      addresses: {
        Row: {
          id: string;
          customer_id: string;
          first_name: string;
          last_name: string;
          phone: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          pincode: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['addresses']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['addresses']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string;
          status: string;
          subtotal: number;
          shipping_cost: number;
          discount: number;
          total: number;
          payment_status: string;
          payment_method: string | null;
          shipping_address: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
      homepage_sections: {
        Row: {
          id: string;
          section_key: string;
          title: string | null;
          subtitle: string | null;
          is_visible: boolean;
          sort_order: number;
          config: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['homepage_sections']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['homepage_sections']['Insert']>;
      };
      banners: {
        Row: {
          id: string;
          title: string | null;
          subtitle: string | null;
          image_url: string | null;
          mobile_image_url: string | null;
          link_url: string | null;
          button_text: string | null;
          position: string;
          is_active: boolean;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['banners']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['banners']['Insert']>;
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          old_value: Record<string, unknown> | null;
          new_value: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
      };
      contact_enquiries: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          email: string | null;
          message: string;
          status: 'new' | 'read' | 'replied' | 'closed';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_enquiries']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['contact_enquiries']['Insert']>;
      };
    };
  };
}

// Helper types
export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type ProductVariant = Database['public']['Tables']['product_variants']['Row'];
export type ProductMedia = Database['public']['Tables']['product_media']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Collection = Database['public']['Tables']['collections']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Customer = Database['public']['Tables']['customers']['Row'];
export type Address = Database['public']['Tables']['addresses']['Row'];
export type CartItem = Database['public']['Tables']['cart_items']['Row'];
export type WishlistItem = Database['public']['Tables']['wishlist_items']['Row'];
export type HomepageSection = Database['public']['Tables']['homepage_sections']['Row'];
export type Banner = Database['public']['Tables']['banners']['Row'];
export type SiteSetting = Database['public']['Tables']['site_settings']['Row'];
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];
export type ContactEnquiry = Database['public']['Tables']['contact_enquiries']['Row'];
export type InventoryTransaction = Database['public']['Tables']['inventory_transactions']['Row'];
export type AdminUser = Database['public']['Tables']['admin_users']['Row'];
