'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { adminAPI } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { FiPackage, FiAlertTriangle, FiSave, FiSearch } from 'react-icons/fi'

export default function StockManagementPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [stockChanges, setStockChanges] = useState({})

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await adminAPI.getAllProducts()
      setProducts(response.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStockChange = (variantId, newStock) => {
    setStockChanges(prev => ({
      ...prev,
      [variantId]: parseInt(newStock)
    }))
  }

  const updateStock = async (variantId, currentStock) => {
    const newStock = stockChanges[variantId]
    if (newStock === undefined || newStock === currentStock) return

    setUpdating(prev => ({ ...prev, [variantId]: true }))
    try {
      await adminAPI.updateStock(variantId, newStock)
      fetchProducts()
      setStockChanges(prev => {
        const newChanges = { ...prev }
        delete newChanges[variantId]
        return newChanges
      })
      alert('Stock updated successfully!')
    } catch (error) {
      alert('Failed to update stock')
    } finally {
      setUpdating(prev => ({ ...prev, [variantId]: false }))
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const lowStockCount = products.reduce((count, product) => {
    return count + product.variants.filter(v => v.stock < 10).length
  }, 0)

  const outOfStockCount = products.reduce((count, product) => {
    return count + product.variants.filter(v => v.stock === 0).length
  }, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
        <p className="text-gray-600">Manage product stock levels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold">{products.length}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-full">
              <FiPackage className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Stock Variants</p>
              <p className="text-3xl font-bold text-orange-600">{lowStockCount}</p>
              <p className="text-xs text-gray-500 mt-1">Stock &lt; 10</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-full">
              <FiAlertTriangle className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
              <p className="text-xs text-gray-500 mt-1">Stock = 0</p>
            </div>
            <div className="p-4 bg-red-50 rounded-full">
              <FiAlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner w-12 h-12"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border-b last:border-b-0">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        SKU: {product.sku} | Category: {product.category?.name}
                      </p>
                    </div>
                  </div>

                  {/* Variants */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.variants.map((variant) => {
                      const hasChange = stockChanges[variant.id] !== undefined
                      const displayStock = hasChange ? stockChanges[variant.id] : variant.stock
                      const stockStatus = 
                        displayStock === 0 ? 'text-red-600 bg-red-50' :
                        displayStock < 10 ? 'text-orange-600 bg-orange-50' :
                        'text-green-600 bg-green-50'

                      return (
                        <div
                          key={variant.id}
                          className={`border rounded-lg p-4 ${
                            displayStock === 0 ? 'border-red-200 bg-red-50/30' :
                            displayStock < 10 ? 'border-orange-200 bg-orange-50/30' :
                            'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{variant.size}</span>
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: variant.colorHex || variant.color }}
                                />
                                <span className="text-sm text-gray-600">{variant.color}</span>
                              </div>
                              {variant.price && (
                                <p className="text-xs text-gray-500">
                                  {formatPrice(variant.price)}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={displayStock}
                              onChange={(e) => handleStockChange(variant.id, e.target.value)}
                              min="0"
                              className={`input text-center font-semibold ${stockStatus}`}
                            />
                            {hasChange && (
                              <button
                                onClick={() => updateStock(variant.id, variant.stock)}
                                disabled={updating[variant.id]}
                                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                                title="Save"
                              >
                                {updating[variant.id] ? (
                                  <div className="spinner w-4 h-4 border-2 border-white"></div>
                                ) : (
                                  <FiSave />
                                )}
                              </button>
                            )}
                          </div>
                          
                          {displayStock === 0 && (
                            <p className="text-xs text-red-600 mt-2 font-medium">Out of Stock</p>
                          )}
                          {displayStock > 0 && displayStock < 10 && (
                            <p className="text-xs text-orange-600 mt-2 font-medium">Low Stock</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                <FiPackage size={48} className="mx-auto mb-4 opacity-50" />
                <p>No products found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
