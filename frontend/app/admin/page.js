'use client'

import { useState, useEffect } from 'react'
import { adminAPI } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { FiDollarSign, FiShoppingBag, FiPackage, FiUsers, FiTrendingUp, FiAlertCircle } from 'react-icons/fi'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats()
      setStats(response)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const statCards = [
    {
      icon: FiDollarSign,
      label: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0),
      color: 'bg-green-500',
    },
    {
      icon: FiShoppingBag,
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      color: 'bg-blue-500',
    },
    {
      icon: FiPackage,
      label: 'Total Products',
      value: stats?.totalProducts || 0,
      color: 'bg-purple-500',
    },
    {
      icon: FiUsers,
      label: 'Total Customers',
      value: stats?.totalCustomers || 0,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color} text-white`}>
                <card.icon size={24} />
              </div>
            </div>
            <p className="text-2xl font-bold mb-1">{card.value}</p>
            <p className="text-sm text-gray-600">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiAlertCircle className="text-yellow-500" size={24} />
            <h2 className="text-xl font-bold">Pending Orders</h2>
          </div>
          <p className="text-3xl font-bold text-yellow-500 mb-2">
            {stats?.pendingOrders || 0}
          </p>
          <p className="text-sm text-gray-600">Orders waiting for processing</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiPackage className="text-red-500" size={24} />
            <h2 className="text-xl font-bold">Low Stock Products</h2>
          </div>
          <p className="text-3xl font-bold text-red-500 mb-2">
            {stats?.lowStockProducts || 0}
          </p>
          <p className="text-sm text-gray-600">Products with stock below 10</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/admin/products/new" className="btn-primary text-center">
            Add Product
          </a>
          <a href="/admin/orders" className="btn-secondary text-center">
            View Orders
          </a>
          <a href="/admin/products" className="btn-secondary text-center">
            Manage Products
          </a>
          <a href="/admin/customers" className="btn-secondary text-center">
            View Customers
          </a>
        </div>
      </div>
    </div>
  )
}
