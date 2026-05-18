'use client'

import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL']
const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
]

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
]

export default function FilterSidebar({ filters, onChange, showSort = false, isMobile = false }) {
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    price: true,
    size: true,
    color: true,
  })

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const handlePriceChange = (field, value) => {
    onChange({ [field]: value })
  }

  const handleSizeToggle = (size) => {
    const sizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size]
    onChange({ sizes })
  }

  const handleColorToggle = (color) => {
    const colors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color]
    onChange({ colors })
  }

  const handleSortChange = (sortBy) => {
    onChange({ sortBy })
  }

  const clearFilters = () => {
    onChange({
      minPrice: '',
      maxPrice: '',
      sizes: [],
      colors: [],
    })
  }

  return (
    <div className={`bg-white ${isMobile ? '' : 'rounded-lg p-6 sticky top-20'}`}>
      {!showSort && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-sm hover:underline"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Sort - Only show when showSort is true */}
      {showSort && (
        <div className="border-b pb-4 mb-6">
          <button
            onClick={() => toggleSection('sort')}
            className="flex items-center justify-between w-full font-medium mb-3"
          >
            <span className="text-base">Sort By</span>
            <FiChevronDown
              className={`transform transition-transform ${
                expandedSections.sort ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedSections.sort && (
            <div className="space-y-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm ${
                    filters.sortBy === option.value
                      ? 'bg-black text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Range */}
      <div className="border-b pb-4 mb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full font-medium mb-3"
        >
          <span>Price Range</span>
          <FiChevronDown
            className={`transform transition-transform ${
              expandedSections.price ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                placeholder="0"
                className="input mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                placeholder="10000"
                className="input mt-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Size */}
      <div className="border-b pb-4 mb-4">
        <button
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full font-medium mb-3"
        >
          <span>Size</span>
          <FiChevronDown
            className={`transform transition-transform ${
              expandedSections.size ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.size && (
          <div className="grid grid-cols-3 gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`py-2 text-sm border rounded-lg transition-colors ${
                  filters.sizes.includes(size)
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full font-medium mb-3"
        >
          <span>Color</span>
          <FiChevronDown
            className={`transform transition-transform ${
              expandedSections.color ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.color && (
          <div className="space-y-2">
            {COLORS.map((color) => (
              <label
                key={color.name}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={filters.colors.includes(color.name)}
                  onChange={() => handleColorToggle(color.name)}
                  className="w-4 h-4"
                />
                <div
                  className="w-6 h-6 rounded-full border-2"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm">{color.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
