'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi'
import { useCartStore } from '@/lib/store'
import { cartAPI, couponAPI } from '@/lib/api'
import { formatPrice, getImageUrl } from '@/lib/utils'

export default function CartPage() {
  const { cart, total: cartTotal, setCart } = useCartStore()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get()
      setCart(response.data.cart, response.data.total)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return

    setUpdating({ ...updating, [itemId]: true })
    try {
      await cartAPI.update(itemId, { quantity })
      await fetchCart()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update quantity')
    } finally {
      setUpdating({ ...updating, [itemId]: false })
    }
  }

  const removeItem = async (itemId) => {
    if (!confirm('Remove this item from cart?')) return

    setUpdating({ ...updating, [itemId]: true })
    try {
      await cartAPI.remove(itemId)
      await fetchCart()
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to remove item')
    } finally {
      setUpdating({ ...updating, [itemId]: false })
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    setCouponLoading(true)
    setCouponError('')
    try {
      const response = await couponAPI.validate(couponCode, cartTotal)
      setCouponDiscount(response.data.discount)
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Invalid coupon code')
      setCouponDiscount(0)
    } finally {
      setCouponLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to get started</p>
          <Link href="/shop/all">
            <button className="btn-primary">Start Shopping</button>
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = cartTotal
  const shipping = subtotal >= 9999 ? 0 : 500
  const total = subtotal + shipping - couponDiscount

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-6 flex gap-6">
                <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={getImageUrl(item.product.images[0]?.url)}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-primary">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-4">
                    Size: {item.variant.size} | Color: {item.variant.color}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updating[item.id]}
                        className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating[item.id]}
                        className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="font-semibold text-lg">
                        {formatPrice(parseFloat(item.product.salePrice || item.product.price) * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updating[item.id]}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="input flex-1"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading || !couponCode}
                    className="btn-secondary whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-sm text-red-500 mt-2">{couponError}</p>
                )}
                {couponDiscount > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    Coupon applied! You saved {formatPrice(couponDiscount)}
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                {subtotal < 9999 && (
                  <p className="text-sm text-gray-600">
                    Add {formatPrice(9999 - subtotal)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Link href="/checkout">
                <button className="btn-primary w-full mb-3">
                  Proceed to Checkout
                </button>
              </Link>
              <Link href="/shop/all">
                <button className="btn-secondary w-full">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
