import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-application-name': 'luxe-tiles',
    },
  },
})

/**
 * Type definitions for database tables
 * Generate these with: npx supabase gen types typescript --project-id PROJECT_ID > types/supabase.ts
 */
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          product_id: number
          name: string
          category: string
          price: number
          original_price: number | null
          description: string | null
          rating: number
          in_stock: boolean
          image_url: string
          cloudinary_public_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['products']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['products']['Row']>
      }
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          profile_image_url: string | null
          cloudinary_public_id: string | null
          address: string | null
          city: string | null
          country: string | null
          postal_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['users']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['users']['Row']>
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          added_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['cart_items']['Row'],
          'id' | 'added_at'
        >
        Update: Partial<Database['public']['Tables']['cart_items']['Row']>
      }
      dreams_collection: {
        Row: {
          id: string
          user_id: string
          inspiration_id: string
          title: string
          category: string | null
          description: string | null
          image_url: string | null
          cloudinary_public_id: string | null
          style: string | null
          color_palette: string | null
          tile_size: string | null
          saved_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['dreams_collection']['Row'],
          'id' | 'saved_at'
        >
        Update: Partial<Database['public']['Tables']['dreams_collection']['Row']>
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          total_amount: number
          tax_amount: number
          shipping_amount: number
          status: string
          shipping_address: string
          billing_address: string | null
          payment_method: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['orders']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['orders']['Row']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['order_items']['Row']>
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          cloudinary_public_id: string
          alt_text: string | null
          is_primary: boolean
          display_order: number
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['product_images']['Row'],
          'id' | 'created_at'
        >
        Update: Partial<Database['public']['Tables']['product_images']['Row']>
      }
      product_specifications: {
        Row: {
          id: string
          product_id: string
          spec_key: string
          spec_value: string
        }
        Insert: Omit<
          Database['public']['Tables']['product_specifications']['Row'],
          'id'
        >
        Update: Partial<
          Database['public']['Tables']['product_specifications']['Row']
        >
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          title: string | null
          comment: string | null
          helpful_count: number
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['reviews']['Row'],
          'id' | 'created_at'
        >
        Update: Partial<Database['public']['Tables']['reviews']['Row']>
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          product_id: string
          added_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['wishlist']['Row'],
          'id' | 'added_at'
        >
        Update: Partial<Database['public']['Tables']['wishlist']['Row']>
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          cloudinary_public_id: string | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['categories']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['categories']['Row']>
      }
    }
  }
}
