'use client'

/**
 * EXAMPLE: How to integrate MongoDB into your admin dashboard
 * This file shows how to replace localStorage calls with MongoDB API calls
 */

import { useProducts, useGallery, useContactMessages, useCloudinaryUpload } from '@/hooks/use-mongodb'
import { useState, useEffect } from 'react'
import { Product } from '@/contexts/admin-context'

export default function AdminIntegrationExample() {
  // Products Management
  const {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    loading: productsLoading,
  } = useProducts()

  // Gallery Management
  const {
    fetchGallery,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
  } = useGallery()

  // Contact Messages
  const {
    fetchMessages,
    markAsRead,
    deleteMessage,
  } = useContactMessages()

  // Image Uploads
  const {
    uploadImage,
    deleteImage,
  } = useCloudinaryUpload()

  const [products, setProducts] = useState<Product[]>([])

  // Example: Load all products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await fetchProducts(undefined, 0, 100)
        setProducts(result.data || [])
      } catch (error) {
        console.error('Failed to load products:', error)
      }
    }
    loadProducts()
  }, [fetchProducts])

  // Example: Add a new product
  const handleAddProduct = async () => {
    try {
      const newProduct = await createProduct({
        name: 'New White Tile',
        category: 'Ceramic Tiles',
        price: 1200,
        pricingType: 'fixed',
        rating: 4.5,
        inStock: true,
        images: ['https://example.com/tile.jpg'],
        image: 'https://example.com/tile.jpg',
        description: 'Beautiful white ceramic tile',
      })

      if (newProduct) {
        setProducts([...products, newProduct])
        console.log('✅ Product created:', newProduct.id)
      }
    } catch (error) {
      console.error('Failed to create product:', error)
    }
  }

  // Example: Update a product
  const handleUpdateProduct = async (productId: string) => {
    try {
      const updated = await updateProduct(productId, {
        price: 1500,
        inStock: false,
      })

      if (updated) {
        setProducts(products.map(p => p.id === productId ? updated : p))
        console.log('✅ Product updated')
      }
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  // Example: Delete a product
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId)
      setProducts(products.filter(p => p.id !== productId))
      console.log('✅ Product deleted')
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  // Example: Upload image and create product with it
  const handleUploadAndCreateProduct = async (imageUrl: string) => {
    try {
      // Upload image to Cloudinary
      const uploadResult = await uploadImage(imageUrl, 'products')
      console.log('✅ Image uploaded:', uploadResult.url)

      // Create product with uploaded image
      const newProduct = await createProduct({
        name: 'Product with Uploaded Image',
        category: 'Marble',
        price: 2500,
        pricingType: 'fixed',
        rating: 4.8,
        inStock: true,
        images: [uploadResult.url],
        image: uploadResult.url,
        description: 'Product created with uploaded image',
      })

      console.log('✅ Product created with uploaded image')
    } catch (error) {
      console.error('Failed to upload and create product:', error)
    }
  }

  // Example: Get and display messages
  const handleLoadMessages = async () => {
    try {
      const result = await fetchMessages(undefined, 0, 50)
      console.log('📧 Messages:', result.data)

      // Mark first message as read
      if (result.data && result.data.length > 0) {
        await markAsRead(result.data[0].id)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  return (
    <div className="p-8 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">MongoDB Integration Examples</h2>

      <div className="space-y-4">
        {/* Products Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Products ({products.length})</h3>

          <div className="space-y-2 mb-4">
            {products.slice(0, 3).map(product => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-gray-100 rounded">
                <span>{product.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleUpdateProduct(product.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddProduct}
            disabled={productsLoading}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {productsLoading ? 'Creating...' : '+ Add Product'}
          </button>
        </section>

        {/* Image Upload Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Image Upload</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload images to Cloudinary and create products with optimized URLs
          </p>
          <button
            onClick={() => handleUploadAndCreateProduct('https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=600')}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            📸 Upload Sample Image & Create Product
          </button>
        </section>

        {/* Messages Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Contact Messages</h3>
          <button
            onClick={handleLoadMessages}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            📧 Load Messages
          </button>
        </section>
      </div>

      {/* Integration Info */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Integration Tips</h3>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>✓ All data is stored in MongoDB, not localStorage</li>
          <li>✓ Images are optimized and hosted on Cloudinary CDN</li>
          <li>✓ Use the hooks from <code className="bg-gray-200 px-1 rounded">/hooks/use-mongodb.ts</code></li>
          <li>✓ All API routes are REST-based and scalable</li>
          <li>✓ Pagination is built-in (skip/limit parameters)</li>
        </ul>
      </div>
    </div>
  )
}

/**
 * MIGRATION GUIDE:
 * 
 * 1. Replace localStorage calls with API calls:
 *    OLD: const products = JSON.parse(localStorage.getItem('admin_products'))
 *    NEW: const { data: products } = await fetchProducts()
 * 
 * 2. In your admin dashboard, use the hooks:
 *    import { useProducts, useGallery, useContactMessages } from '@/hooks/use-mongodb'
 * 
 * 3. Update component logic:
 *    - Remove useEffect with localStorage.setItem
 *    - Use API calls instead
 *    - Handle loading and error states
 * 
 * 4. Test each section:
 *    - Products CRUD
 *    - Gallery CRUD
 *    - Message management
 *    - Image uploads
 * 
 * 5. Remove or keep localStorage?
 *    - REMOVE: If moving entirely to MongoDB
 *    - KEEP: For offline functionality (hybrid approach)
 */
