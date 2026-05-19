'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiHeart, FiShoppingBag, FiMinus, FiPlus, FiTruck, FiRefreshCw } from 'react-icons/fi'
import { formatPrice, calculateDiscount, getImageUrl } from '@/lib/utils'
import { useAuthStore, useWishlistStore, useCartStore } from '@/lib/store'
import { wishlistAPI, cartAPI } from '@/lib/api'

export default function ProductDetailClient({ product }) {
  const { isAuthenticated } = useAuthStore()
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore()
  const { openCart } = useCartStore()
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(
    wishlistItems?.some(item => item.productId === product.id) || false
  )

  const sizes = [...new Set(product.variants?.map(v => v.size))]
  const colors = [...new Set(product.variants?.map(v => v.color))]

  const handleSizeSelect = (size) => {
    setSelectedSize(size)
    updateVariant(size, selectedColor)
  }

  const handleColorSelect = (color) => {
    setSelectedColor(color)
    updateVariant(selectedSize, color)
  }

  const updateVariant = (size, color) => {
    if (size && color) {
      const variant = product.variants.find(v => v.size === size && v.color === color)
      setSelectedVariant(variant || null)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert('Please select size and color')
      return
    }

    if (selectedVariant.stock < quantity) {
      alert('Not enough stock available')
      return
    }

    setLoading(true)
    try {
      await cartAPI.add({ productId: product.id, variantId: selectedVariant.id, quantity })
      openCart()
    } catch (error) {
      alert('Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  const handleWishlistToggle = async () => {
    setLoading(true)
    try {
      if (isAuthenticated) {
        // For logged-in users, use API
        if (isWishlisted) {
          await wishlistAPI.remove(product.id)
          removeFromWishlist(product.id)
        } else {
          await wishlistAPI.add(product.id)
          addToWishlist({ productId: product.id, product })
        }
      } else {
        // For non-logged-in users, use localStorage only
        if (isWishlisted) {
          removeFromWishlist(product.id)
        } else {
          addToWishlist({ productId: product.id, product })
        }
      }
      setIsWishlisted(!isWishlisted)
    } catch (error) {
      console.error('Wishlist error:', error)
      const errorMsg = error.response?.data?.error || 'Failed to update wishlist'
      
      // If user authentication error, redirect to login
      if (error.response?.status === 401) {
        if (confirm('Your session has expired. Please log in again.')) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      } else {
        alert(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  const discount = calculateDiscount(product.price, product.salePrice)
  const isOnSale = product.salePrice && product.salePrice < product.price

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href={`/shop/${product.gender}`} className="hover:text-primary capitalize">
            {product.gender}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Image
                src={getImageUrl(product.images[selectedImage]?.url)}
                alt={product.name}
                fill
                className="object-cover"
              />
              {isOnSale && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                  -{discount}% OFF
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={getImageUrl(image.url)}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              {isOnSale ? (
                <>
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-8">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium">Size</label>
                <Link href="/size-guide" className="text-sm text-primary hover:underline">
                  Size Guide
                </Link>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`py-3 text-sm border rounded-lg transition-colors ${
                      selectedSize === size
                        ? 'bg-primary text-white border-primary'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="font-medium block mb-3">
                Color {selectedColor && `- ${selectedColor}`}
              </label>
              <div className="flex gap-3">
                {colors.map((color) => {
                  const variant = product.variants.find(v => v.color === color)
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`w-12 h-12 rounded-full border-2 ${
                        selectedColor === color ? 'border-primary' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: variant?.colorHex || '#ccc' }}
                      title={color}
                    />
                  )
                })}
              </div>
            </div>

            {/* Stock Status */}
            {selectedVariant && (
              <p className="mb-6 text-sm">
                {selectedVariant.stock > 0 ? (
                  <span className="text-green-600">In Stock ({selectedVariant.stock} available)</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="font-medium block mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={loading || !selectedVariant || selectedVariant?.stock === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <FiShoppingBag />
                Add to Cart
              </button>
              <button
                onClick={handleWishlistToggle}
                disabled={loading}
                className={`btn-secondary px-6 ${isWishlisted ? 'bg-red-50 text-red-500' : ''}`}
              >
                <FiHeart fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <FiTruck className="text-primary" size={24} />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over Rs. 9,999</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiRefreshCw className="text-primary" size={24} />
                <div>
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-sm text-gray-600">7-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 border-t">
          <div className="py-8">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <div className="prose max-w-none">
              <p>{product.description}</p>
              {product.material && (
                <p className="mt-4">
                  <strong>Material:</strong> {product.material}
                </p>
              )}
              {product.fit && (
                <p>
                  <strong>Fit:</strong> {product.fit}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
