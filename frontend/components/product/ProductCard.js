'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi'
import { formatPrice, calculateDiscount, getImageUrl } from '@/lib/utils'
import { useAuthStore, useWishlistStore, useCartStore } from '@/lib/store'
import { wishlistAPI, cartAPI } from '@/lib/api'

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuthStore()
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore()
  const { openCart } = useCartStore()
  const [isWishlisted, setIsWishlisted] = useState(
    wishlistItems?.some(item => item.productId === product.id) || false
  )
  const [loading, setLoading] = useState(false)

  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    setLoading(true)
    try {
      if (isWishlisted) {
        await wishlistAPI.remove(product.id)
        removeFromWishlist(product.id)
      } else {
        await wishlistAPI.add(product.id)
        addToWishlist({ productId: product.id, product })
      }
      setIsWishlisted(!isWishlisted)
    } catch (error) {
      console.error('Wishlist error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAdd = async (e) => {
    e.preventDefault()
    if (!product.variants || product.variants.length === 0) return

    // Get first available variant
    const variant = product.variants.find(v => v.stock > 0)
    if (!variant) {
      alert('Product is out of stock')
      return
    }

    setLoading(true)
    try {
      await cartAPI.add(product.id, variant.id, 1)
      openCart()
    } catch (error) {
      console.error('Add to cart error:', error)
      alert('Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  const discount = calculateDiscount(product.price, product.salePrice)
  const isOnSale = product.salePrice && product.salePrice < product.price

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
          <Image
            src={getImageUrl(product.images?.[0]?.imageUrl || product.images?.[0]?.url)}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {isOnSale && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                BEST SELLER
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlistToggle}
              disabled={loading}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 hover:bg-white text-gray-900'
              }`}
              aria-label="Add to wishlist"
            >
              <FiHeart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleQuickAdd}
              disabled={loading}
              className="p-2 bg-white/90 hover:bg-white rounded-full backdrop-blur-sm transition-all"
              aria-label="Quick add to cart"
            >
              <FiShoppingBag size={18} />
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {product.variants?.every(v => v.stock === 0) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded font-semibold">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            {isOnSale ? (
              <>
                <span className="font-semibold text-primary">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-semibold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Available Sizes */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex gap-1 mt-2">
              {[...new Set(product.variants.map(v => v.size))].slice(0, 5).map(size => (
                <span
                  key={size}
                  className="text-xs border border-gray-300 px-2 py-1 rounded"
                >
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
