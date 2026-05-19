'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { paymentAPI } from '@/lib/api'
import { FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi'

// PayHere can hit return_url before the notify_url webhook arrives.
// We poll /api/payments/status up to MAX_POLLS times with POLL_INTERVAL_MS delay.
const MAX_POLLS = 12      // 12 × 2s = 24 seconds max wait
const POLL_INTERVAL_MS = 2000

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams.get('orderNumber')

  const [status, setStatus] = useState('checking') // checking | paid | pending | failed | cancelled
  const [pollCount, setPollCount] = useState(0)
  const [orderData, setOrderData] = useState(null)
  const pollRef = useRef(null)

  useEffect(() => {
    if (!orderNumber) {
      router.replace('/')
      return
    }
    poll()
    return () => clearTimeout(pollRef.current)
  }, [orderNumber])

  const poll = async () => {
    try {
      const res = await paymentAPI.getStatus(orderNumber)
      const data = res.data
      setOrderData(data)

      if (data.paymentStatus === 'paid') {
        setStatus('paid')
        return
      }

      if (data.paymentStatus === 'failed' || data.paymentStatus === 'cancelled') {
        setStatus(data.paymentStatus)
        return
      }

      // Still pending — schedule next poll
      setPollCount((c) => {
        const next = c + 1
        if (next < MAX_POLLS) {
          pollRef.current = setTimeout(poll, POLL_INTERVAL_MS)
        } else {
          // Timed out waiting for webhook — show pending state
          setStatus('pending')
        }
        return next
      })
    } catch {
      setStatus('pending')
    }
  }

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-xl font-semibold">Verifying your payment…</p>
          <p className="text-gray-500 mt-1 text-sm">This usually takes a few seconds</p>
        </div>
      </div>
    )
  }

  if (status === 'paid') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <FiCheckCircle className="text-green-500" size={72} />
        <div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-1">Your order <span className="font-semibold text-black">{orderNumber}</span> has been confirmed.</p>
          {orderData?.transactionId && (
            <p className="text-sm text-gray-400">PayHere ref: {orderData.transactionId}</p>
          )}
        </div>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/account/orders">
            <button className="btn-primary">View My Orders</button>
          </Link>
          <Link href="/shop/all">
            <button className="btn-secondary">Continue Shopping</button>
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <FiClock className="text-yellow-500" size={72} />
        <div>
          <h1 className="text-2xl font-bold text-yellow-600 mb-2">Payment Pending</h1>
          <p className="text-gray-600 max-w-md">
            Your payment is being processed. We will update your order once confirmed.
            Order number: <span className="font-semibold text-black">{orderNumber}</span>
          </p>
        </div>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/account/orders">
            <button className="btn-primary">Check Order Status</button>
          </Link>
          <Link href="/shop/all">
            <button className="btn-secondary">Continue Shopping</button>
          </Link>
        </div>
      </div>
    )
  }

  // failed or cancelled
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <FiAlertCircle className="text-red-500" size={72} />
      <div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">
          {status === 'cancelled' ? 'Payment Cancelled' : 'Payment Failed'}
        </h1>
        <p className="text-gray-600 max-w-md">
          {status === 'cancelled'
            ? 'You cancelled the payment. Your order has been cancelled and no charge was made.'
            : 'Your payment could not be processed. No charge was made.'}
        </p>
        <p className="text-sm text-gray-400 mt-2">Order: {orderNumber}</p>
      </div>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/checkout">
          <button className="btn-primary">Try Again</button>
        </Link>
        <Link href="/shop/all">
          <button className="btn-secondary">Continue Shopping</button>
        </Link>
      </div>
    </div>
  )
}
