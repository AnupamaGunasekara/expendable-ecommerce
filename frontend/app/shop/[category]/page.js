'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ProductGrid from '@/components/product/ProductGrid'
import FilterSidebar from '@/components/shop/FilterSidebar'
import { productAPI } from '@/lib/api'
import { FiGrid, FiList } from 'react-icons/fi'

export default function ShopPage({ params }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { category } = params
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: category !== 'all' ? category : '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || [],
    colors: searchParams.get('colors')?.split(',').filter(Boolean) || [],
    sortBy: searchParams.get('sortBy') || 'featured',
    page: parseInt(searchParams.get('page') || '1'),
  })
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [filters, category])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {
        limit: 12,
        page: filters.page,
      }

      // Handle special categories
      if (category === 'new') {
        params.isNew = 'true'
      } else if (category === 'sale') {
        params.onSale = 'true'
      } else if (category !== 'all') {
        params.gender = category
      } else if (filters.category) {
        params.gender = filters.category
      }

      // Add price filters
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice

      // Add size filter - join array to comma-separated string
      if (filters.sizes && filters.sizes.length > 0) {
        params.size = filters.sizes.join(',')
      }

      // Add color filter - join array to comma-separated string
      if (filters.colors && filters.colors.length > 0) {
        params.color = filters.colors.join(',')
      }

      // Handle sorting
      let sortField = 'createdAt'
      let sortOrder = 'desc'

      switch (filters.sortBy) {
        case 'featured':
          sortField = 'isFeatured'
          sortOrder = 'desc'
          break
        case 'newest':
          sortField = 'createdAt'
          sortOrder = 'desc'
          break
        case 'price-asc':
          sortField = 'price'
          sortOrder = 'asc'
          break
        case 'price-desc':
          sortField = 'price'
          sortOrder = 'desc'
          break
        case 'name-asc':
          sortField = 'name'
          sortOrder = 'asc'
          break
        case 'name-desc':
          sortField = 'name'
          sortOrder = 'desc'
          break
      }

      params.sort = sortField
      params.order = sortOrder

      console.log('Fetching products with params:', params)
      const response = await productAPI.getAll(params)
      console.log('Shop products response:', response.data)
      setProducts(response.data.products || [])
      setTotalPages(response.data.pagination?.totalPages || 1)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 })
  }

  const handleSortChange = (sortBy) => {
    setFilters({ ...filters, sortBy, page: 1 })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2 capitalize">
            {category === 'all' 
              ? 'All Products' 
              : category === 'new' 
              ? 'New Collection' 
              : category === 'sale' 
              ? 'Sale' 
              : category}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${products.length} products`}
          </p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterSidebar filters={filters} onChange={handleFilterChange} />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Showing {products.length} products
              </p>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="input text-sm"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <ProductGrid products={products} columns={3} />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setFilters({ ...filters, page })}
                        className={`px-4 py-2 rounded-lg ${
                          filters.page === page
                            ? 'bg-primary text-white'
                            : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No products found</p>
                <button
                  onClick={() => setFilters({
                    category: category !== 'all' ? category : '',
                    minPrice: '',
                    maxPrice: '',
                    sizes: [],
                    colors: [],
                    sortBy: 'featured',
                    page: 1,
                  })}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
