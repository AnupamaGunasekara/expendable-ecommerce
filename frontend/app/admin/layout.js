'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'
import { FiHome, FiPackage, FiShoppingBag, FiUsers, FiSettings, FiLogOut, FiMenu, FiBox } from 'react-icons/fi'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    // Skip redirect on login page
    if (pathname === '/admin/login') {
      return
    }
    
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }
    
    // Check if user has admin access
    const isAdmin = user?.role === 'admin' || user?.email?.includes('admin')
    if (!isAdmin) {
      router.push('/')
    }
  }, [isAuthenticated, user, pathname, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', href: '/admin' },
    { icon: FiPackage, label: 'Products', href: '/admin/products' },
    { icon: FiBox, label: 'Inventory', href: '/admin/inventory' },
    { icon: FiShoppingBag, label: 'Orders', href: '/admin/orders' },
    { icon: FiUsers, label: 'Customers', href: '/admin/customers' },
    { icon: FiSettings, label: 'Settings', href: '/admin/settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">EXPENDABLES</h1>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>

        <nav className="px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="px-4 py-2 mb-2">
            <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
