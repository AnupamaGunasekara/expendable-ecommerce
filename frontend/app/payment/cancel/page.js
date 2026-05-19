'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FiXCircle } from 'react-icons/fi'

// PayHere redirects here when the customer clicks "Cancel" on their payment page.
// IMPORTANT: treat this page as informational only.
// The authoritative cancellation is handled by notify_url (status_code -1) on the backend.
export default function PaymentCancelPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <FiXCircle className="text-orange-500" size={72} />
      <div>
        <h1 className="text-2xl font-bold text-orange-600 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 max-w-md">
          You cancelled the payment process. Your cart items are still saved — you can go back
          and try again at any time.
        </p>
        {orderNumber && (
          <p className="text-sm text-gray-400 mt-2">Order reference: {orderNumber}</p>
        )}
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/checkout">
          <button className="btn-primary">Return to Checkout</button>
        </Link>
        <Link href="/shop/all">
          <button className="btn-secondary">Continue Shopping</button>
        </Link>
      </div>
    </div>
  )
}
