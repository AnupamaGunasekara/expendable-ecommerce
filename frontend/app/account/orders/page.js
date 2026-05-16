'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'
import { orderAPI } from '@/lib/api'
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils'
import { FiPackage, FiClock, FiTruck, FiCheck, FiX } from 'react-icons/fi'

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchOrders()
  }, [isAuthenticated])

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders()
      setOrders(response.data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock />
      case 'processing': return <FiPackage />
      case 'shipped': return <FiTruck />
      case 'delivered': return <FiCheck />
      case 'cancelled': return <FiX />
      default: return <FiPackage />
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
          <Link href="/account">
            <button className="btn-secondary">Back to Account</button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <FiPackage size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <Link href="/shop/all">
              <button className="btn-primary">Start Shopping</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${getOrderStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(order.total)}
                    </p>
                    <span className={`text-sm px-3 py-1 rounded-full capitalize ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.productName} ({item.size}/{item.color}) x {item.quantity}
                        </span>
                        <span className="font-medium">{formatPrice(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t mt-4 pt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/account/orders/${order.orderNumber}`}>
                      <button className="btn-secondary text-sm">View Details</button>
                    </Link>
                    {order.status === 'pending' && (
                      <button
                        onClick={async () => {
                          if (confirm('Cancel this order?')) {
                            try {
                              await orderAPI.cancel(order.id)
                              fetchOrders()
                            } catch (error) {
                              alert('Failed to cancel order')
                            }
                          }
                        }}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
