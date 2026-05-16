'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiX, FiSearch } from 'react-icons/fi'
import { useUIStore } from '@/lib/store'
import { productAPI } from '@/lib/api'
import { formatPrice, debounce } from '@/lib/utils'

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('')
      setResults([])
    }
  }, [isSearchOpen])

  const searchProducts = debounce(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const data = await productAPI.search(searchQuery)
      setResults(data.products || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, 500)

  const handleSearch = (e) => {
    const value = e.target.value
    setQuery(value)
    searchProducts(value)
  }

  if (!isSearchOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <FiSearch size={24} className="text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search for products..."
              className="flex-1 text-lg outline-none"
              autoFocus
            />
            <button
              onClick={closeSearch}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={closeSearch}
                  className="group"
                >
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <Image
                      src={product.images[0]?.imageUrl || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    {product.salePrice ? (
                      <>
                        <span className="font-semibold text-primary">
                          {formatPrice(product.salePrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">
              No products found for "{query}"
            </p>
            <p className="text-sm text-gray-500">
              Try different keywords or browse our collections
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Start typing to search for products
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
