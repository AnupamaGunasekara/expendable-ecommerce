import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/product/ProductDetailClient'
import { productAPI } from '@/lib/api'

async function getProduct(slug) {
  try {
    const response = await fetch(`http://localhost:5030/api/products/slug/${slug}`, {
      cache: 'no-store'
    })
    if (!response.ok) return null
    const data = await response.json()
    return data.product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
