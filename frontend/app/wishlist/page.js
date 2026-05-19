'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiHeart, FiTrash2, FiShoppingBag } from 'react-icons/fi'
import Image from 'next/image'
import { useAuthStore, useWishlistStore } from '@/lib/store'
import { wishlistAPI, cartAPI } from '@/lib/api'
import { formatPrice, getImageUrl } from '@/lib/utils'

export default function WishlistPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { items, setItems, init } = useWishlistStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [isAuthenticated])

  const fetchWishlist = async () => {
    try {
      if (isAuthenticated) {
        // Fetch from server for logged-in users
        const response = await wishlistAPI.getAll()
        setItems(response.data.wishlist || [])
      } else {
        // Load from localStorage for non-logged-in users
        init()
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      // Fallback to localStorage if API fails
      init()
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (productId) => {
    try {
      if (isAuthenticated) {
        await wishlistAPI.remove(productId)
      }
      setItems(items.filter(item => item.productId !== productId))
    } catch (error) {
      alert('Failed to remove item')
    }
  }

  const handleAddToCart = async (product) => {
    if (!product.variants || product.variants.length === 0) {
      alert('Product has no variants')
      return
    }

    const variant = product.variants.find(v => v.stock > 0)
    if (!variant) {
      alert('Product is out of stock')
      return
    }

    try {
      await cartAPI.add({ productId: product.id, variantId: variant.id, quantity: 1 })
      alert('Added to cart!')
    } catch (error) {
      alert('Failed to add to cart')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <FiHeart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save items you love for later</p>
            <Link href="/shop/all">
              <button className="btn-primary">Start Shopping</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <Image
                    src={getImageUrl(item.product.images?.[0]?.url)}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="p-4">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-medium mb-2 hover:text-primary line-clamp-2">
                      {item.product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mb-4">
                    {item.product.salePrice ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">
                          {formatPrice(item.product.salePrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(item.product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold">
                        {formatPrice(item.product.price)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(item.product)}
                    className="btn-primary w-full text-sm flex items-center justify-center gap-2"
                  >
                    <FiShoppingBag size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
