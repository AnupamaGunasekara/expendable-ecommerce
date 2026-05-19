'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useAuthStore, useCartStore } from '@/lib/store'
import { cartAPI, orderAPI, couponAPI, paymentAPI } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { FiCreditCard, FiDollarSign, FiLock } from 'react-icons/fi'

/**
 * Programmatically POST a form to PayHere checkout URL.
 * window.location redirect won't work because PayHere requires a POST.
 */
const redirectToPayHere = (checkoutUrl, params) => {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = checkoutUrl

  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = value
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { cart, total: cartTotal, setCart } = useCartStore()

  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)

  const [formData, setFormData] = useState({
    // Shipping Address
    shippingFirstName: user?.firstName || '',
    shippingLastName: user?.lastName || '',
    shippingPhone: user?.phone || '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingPostalCode: '',

    // Billing same as shipping
    billingDifferent: false,
    billingFirstName: '',
    billingLastName: '',
    billingPhone: '',
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingState: '',
    billingPostalCode: '',

    paymentMethod: 'cod',
    customerNotes: '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout')
      return
    }
    fetchCart()
  }, [isAuthenticated])

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get()
      setCart(response.data.cart, response.data.total)
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    try {
      const response = await couponAPI.validate(couponCode, cartTotal)
      setCouponDiscount(response.data.discount)
      toast.success(`Coupon applied! You saved ${formatPrice(response.data.discount)}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code')
      setCouponDiscount(0)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const shippingAddress = {
        firstName: formData.shippingFirstName,
        lastName: formData.shippingLastName,
        phone: formData.shippingPhone,
        address1: formData.shippingAddress1,
        address2: formData.shippingAddress2,
        city: formData.shippingCity,
        state: formData.shippingState,
        postalCode: formData.shippingPostalCode,
        country: 'Sri Lanka',
      }

      const billingAddress = formData.billingDifferent
        ? {
            firstName: formData.billingFirstName,
            lastName: formData.billingLastName,
            phone: formData.billingPhone,
            address1: formData.billingAddress1,
            address2: formData.billingAddress2,
            city: formData.billingCity,
            state: formData.billingState,
            postalCode: formData.billingPostalCode,
            country: 'Sri Lanka',
          }
        : shippingAddress

      const orderData = {
        items: cart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        shippingAddress,
        billingAddress,
        paymentMethod: formData.paymentMethod,
        customerNotes: formData.customerNotes,
        couponCode: couponCode || undefined,
      }

      // ── Create the order ────────────────────────────────────────────────────
      const orderRes = await orderAPI.create(orderData)
      const { orderNumber } = orderRes.data.order

      // ── COD: clear cart + go to success page immediately ───────────────────
      if (formData.paymentMethod === 'cod') {
        await cartAPI.clear()
        router.push(`/order-success?orderNumber=${orderNumber}`)
        return
      }

      // ── Card: initiate PayHere, then redirect browser to PayHere ───────────
      toast.loading('Redirecting to payment gateway…', { id: 'payhere-redirect' })
      const payRes = await paymentAPI.initiate(orderNumber)
      const { checkoutUrl, params } = payRes.data

      // Clear cart before leaving — the notify_url will confirm stock/status
      await cartAPI.clear()

      // This programmatic POST replaces the current page with PayHere's form
      redirectToPayHere(checkoutUrl, params)
      // (execution stops here — browser navigates away)
    } catch (error) {
      toast.dismiss('payhere-redirect')
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to place order. Please try again.'
      )
      setLoading(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link href="/shop/all">
            <button className="btn-primary">Start Shopping</button>
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = cartTotal || 0
  const shipping = subtotal >= 9999 ? 0 : 500
  const total = subtotal + shipping - couponDiscount

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="shippingFirstName" value={formData.shippingFirstName} onChange={handleChange} placeholder="First Name *" className="input" required />
                  <input type="text" name="shippingLastName" value={formData.shippingLastName} onChange={handleChange} placeholder="Last Name *" className="input" required />
                  <input type="tel" name="shippingPhone" value={formData.shippingPhone} onChange={handleChange} placeholder="Phone *" className="input col-span-2" required />
                  <input type="text" name="shippingAddress1" value={formData.shippingAddress1} onChange={handleChange} placeholder="Address Line 1 *" className="input col-span-2" required />
                  <input type="text" name="shippingAddress2" value={formData.shippingAddress2} onChange={handleChange} placeholder="Address Line 2 (Optional)" className="input col-span-2" />
                  <input type="text" name="shippingCity" value={formData.shippingCity} onChange={handleChange} placeholder="City *" className="input" required />
                  <input type="text" name="shippingState" value={formData.shippingState} onChange={handleChange} placeholder="State/Province *" className="input" required />
                  <input type="text" name="shippingPostalCode" value={formData.shippingPostalCode} onChange={handleChange} placeholder="Postal Code *" className="input col-span-2" required />
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <input type="checkbox" name="billingDifferent" checked={formData.billingDifferent} onChange={handleChange} className="w-4 h-4" />
                  <label className="font-medium">Billing address is different</label>
                </div>

                {formData.billingDifferent && (
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="billingFirstName" value={formData.billingFirstName} onChange={handleChange} placeholder="First Name *" className="input" required />
                    <input type="text" name="billingLastName" value={formData.billingLastName} onChange={handleChange} placeholder="Last Name *" className="input" required />
                    <input type="tel" name="billingPhone" value={formData.billingPhone} onChange={handleChange} placeholder="Phone *" className="input col-span-2" required />
                    <input type="text" name="billingAddress1" value={formData.billingAddress1} onChange={handleChange} placeholder="Address Line 1 *" className="input col-span-2" required />
                    <input type="text" name="billingAddress2" value={formData.billingAddress2} onChange={handleChange} placeholder="Address Line 2 (Optional)" className="input col-span-2" />
                    <input type="text" name="billingCity" value={formData.billingCity} onChange={handleChange} placeholder="City *" className="input" required />
                    <input type="text" name="billingState" value={formData.billingState} onChange={handleChange} placeholder="State/Province *" className="input" required />
                    <input type="text" name="billingPostalCode" value={formData.billingPostalCode} onChange={handleChange} placeholder="Postal Code *" className="input col-span-2" required />
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary'}`}>
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="w-4 h-4 accent-primary" />
                    <FiDollarSign size={22} className="text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </label>

                  {/* Credit / Debit Card via PayHere */}
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary'}`}>
                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} className="w-4 h-4 accent-primary" />
                    <FiCreditCard size={22} className="text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium">Credit / Debit Card</p>
                      <p className="text-sm text-gray-500">Visa, Mastercard, AMEX — secured by PayHere</p>
                    </div>
                    <FiLock size={14} className="text-gray-400" />
                  </label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
                    You will be redirected to PayHere's secure payment page to complete your payment. Your order is only confirmed after payment is verified.
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Order Notes (Optional)</h2>
                <textarea name="customerNotes" value={formData.customerNotes} onChange={handleChange} placeholder="Special instructions for delivery..." className="input min-h-[100px]" />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="flex-1">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(parseFloat(item.product.salePrice || item.product.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      className="input flex-1 text-sm"
                    />
                    <button type="button" onClick={applyCoupon} className="btn-secondary text-sm">
                      Apply
                    </button>
                  </div>
                  {couponDiscount > 0 && (
                    <p className="text-sm text-green-600 mt-2">Saved {formatPrice(couponDiscount)}</p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {formData.paymentMethod === 'card' ? 'Redirecting…' : 'Placing Order…'}
                    </>
                  ) : formData.paymentMethod === 'card' ? (
                    <>
                      <FiLock size={16} />
                      Pay {formatPrice(total)} Securely
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing an order, you agree to our{' '}
                  <Link href="/terms" className="underline">Terms & Conditions</Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
