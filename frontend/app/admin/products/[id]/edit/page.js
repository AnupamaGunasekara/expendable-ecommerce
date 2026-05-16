'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { adminAPI, categoryAPI, productAPI } from '@/lib/api'
import { FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    salePrice: '',
    sku: '',
    categoryId: '',
    gender: 'unisex',
    isFeatured: false,
    isNew: false,
    isBestSeller: false,
    onSale: false,
    isActive: true,
    material: '',
    fit: '',
    tags: '',
  })
  const [images, setImages] = useState([])
  const [variants, setVariants] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesRes, productRes] = await Promise.all([
        adminAPI.getAllCategories(),
        productAPI.getById(params.id)
      ])
      
      console.log('Categories:', categoriesRes.data)
      setCategories(categoriesRes.data.categories || [])
      
      const product = productRes.data.product
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        price: product.price || '',
        salePrice: product.salePrice || '',
        sku: product.sku || '',
        categoryId: product.categoryId || '',
        gender: product.gender || 'unisex',
        isFeatured: product.isFeatured || false,
        isNew: product.isNew || false,
        isBestSeller: product.isBestSeller || false,
        onSale: product.onSale || false,
        isActive: product.isActive !== false,
        material: product.material || '',
        fit: product.fit || '',
        tags: product.tags || '',
      })
      
      setImages(product.images?.length > 0 ? product.images : [{ url: '', altText: '', isPrimary: true }])
      setVariants(product.variants?.length > 0 ? product.variants : [
        { size: 'M', color: 'Black', colorHex: '#000000', sku: '', stock: 0, price: '' }
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Failed to load product')
    } finally {
      setLoadingData(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (index, field, value) => {
    const newImages = [...images]
    newImages[index][field] = value
    setImages(newImages)
  }

  const addImage = () => {
    setImages([...images, { url: '', altText: '', isPrimary: false }])
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants]
    newVariants[index][field] = value
    setVariants(newVariants)
  }

  const addVariant = () => {
    setVariants([...variants, { size: 'M', color: 'Black', colorHex: '#000000', sku: '', stock: 0, price: '' }])
  }

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        categoryId: parseInt(formData.categoryId),
        images: images.filter(img => img.url),
        variants: variants.map(v => ({
          ...v,
          stock: parseInt(v.stock),
          price: v.price ? parseFloat(v.price) : null
        }))
      }

      await adminAPI.updateProduct(params.id, productData)
      alert('Product updated successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      alert(error.response?.data?.error || 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="spinner w-12 h-12"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Product</h1>
          <p className="text-gray-600">Update product information</p>
        </div>
        <button
          onClick={() => router.back()}
          className="btn-secondary flex items-center gap-2"
        >
          <FiX /> Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SKU *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Regular Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sale Price</label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Material</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fit</label>
              <input
                type="text"
                name="fit"
                value={formData.fit}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Short Description</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows="2"
                className="input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Full Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="input"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* Product Flags */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">New</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Best Seller</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="onSale"
                checked={formData.onSale}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">On Sale</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Active</span>
            </label>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Product Images</h2>
          {images.map((image, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={image.url}
                  onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                  className="input"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Alt Text"
                  value={image.altText}
                  onChange={(e) => handleImageChange(index, 'altText', e.target.value)}
                  className="input"
                />
              </div>
              <label className="flex items-center gap-2 px-4">
                <input
                  type="checkbox"
                  checked={image.isPrimary}
                  onChange={(e) => handleImageChange(index, 'isPrimary', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm whitespace-nowrap">Primary</span>
              </label>
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImage}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <FiPlus /> Add Image
          </button>
        </div>

        {/* Product Variants */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Product Variants</h2>
          {variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
              <div>
                <select
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                  className="input"
                >
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="2XL">2XL</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Color"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <input
                  type="color"
                  value={variant.colorHex}
                  onChange={(e) => handleVariantChange(index, 'colorHex', e.target.value)}
                  className="h-11 w-full rounded cursor-pointer"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="SKU"
                  value={variant.sku}
                  onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                  className="input"
                  min="0"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                  className="input"
                  step="0.01"
                />
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <FiPlus /> Add Variant
          </button>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <FiSave /> {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
