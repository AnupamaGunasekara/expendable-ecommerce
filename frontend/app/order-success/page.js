'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FiCheckCircle, FiPackage, FiTruck } from 'react-icons/fi'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <FiCheckCircle className="mx-auto text-green-500" size={80} />
          </div>

          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your order number is:
          </p>

          <div className="bg-gray-100 rounded-lg p-4 mb-8">
            <p className="text-2xl font-bold text-primary">#{orderNumber}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <FiPackage className="mx-auto text-blue-600 mb-3" size={32} />
              <h3 className="font-bold mb-2">Processing</h3>
              <p className="text-sm text-gray-600">
                Your order is being processed and will be shipped soon
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <FiTruck className="mx-auto text-green-600 mb-3" size={32} />
              <h3 className="font-bold mb-2">Delivery</h3>
              <p className="text-sm text-gray-600">
                Estimated delivery in 3-5 business days
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <p className="text-sm">
              <strong>Order confirmation</strong> has been sent to your email. 
              You can track your order from your account dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account/orders">
              <button className="btn-primary w-full sm:w-auto">
                View Orders
              </button>
            </Link>
            <Link href="/shop/all">
              <button className="btn-secondary w-full sm:w-auto">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
