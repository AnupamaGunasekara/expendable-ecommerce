'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'
import { FiUser, FiPackage, FiMapPin, FiHeart, FiLogOut } from 'react-icons/fi'

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const menuItems = [
    { icon: FiUser, label: 'Profile', href: '/account/profile', description: 'Manage your personal information' },
    { icon: FiPackage, label: 'Orders', href: '/account/orders', description: 'View your order history' },
    { icon: FiMapPin, label: 'Addresses', href: '/account/addresses', description: 'Manage delivery addresses' },
    { icon: FiHeart, label: 'Wishlist', href: '/wishlist', description: 'View saved items' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-gray-600">Welcome back, {user.firstName}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <item.icon size={32} className="text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{item.label}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow text-left"
          >
            <FiLogOut size={32} className="text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Logout</h3>
            <p className="text-sm text-gray-600">Sign out of your account</p>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-primary mb-2">0</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-primary mb-2">0</p>
              <p className="text-sm text-gray-600">Wishlist Items</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-primary mb-2">0</p>
              <p className="text-sm text-gray-600">Saved Addresses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
