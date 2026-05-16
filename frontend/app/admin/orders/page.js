'use client'

import { useState, useEffect } from 'react'
import { adminAPI } from '@/lib/api'
import { formatPrice, formatDate } from '@/lib/utils'
import { FiPackage, FiSearch } from 'react-icons/fi'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await adminAPI.getAllOrders({ status: filter !== 'all' ? filter : undefined })
      setOrders(response.data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus)
      fetchOrders()
    } catch (error) {
      alert('Failed to update order status')
    }
  }

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-gray-600">Manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            All Orders
          </button>
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap ${
                filter === status ? 'bg-primary text-white' : 'bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiPackage className="text-gray-400" />
                      <span className="font-medium">#{order.orderNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.user?.firstName} {order.user?.lastName}</p>
                    <p className="text-sm text-gray-500">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                      {order.paymentMethod === 'cod' ? 'COD' : 'Card'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="text-xs px-2 py-1 rounded-full border capitalize"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`/admin/orders/${order.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
