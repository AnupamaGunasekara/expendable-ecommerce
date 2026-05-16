'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function CategoryTiles({ categories = defaultCategories }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={category.link}
          className="group relative aspect-[4/5] overflow-hidden rounded-lg"
        >
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h3 className="text-3xl font-bold mb-2">{category.name}</h3>
            <p className="text-sm mb-4">{category.description}</p>
            <span className="px-6 py-2 border-2 border-white rounded-full font-medium group-hover:bg-white group-hover:text-black transition-all">
              Shop Now
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

const defaultCategories = [
  {
    name: 'MEN',
    slug: 'men',
    description: 'Bold & Masculine Designs',
    image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800&q=80',
    link: '/shop/men',
  },
  {
    name: 'WOMEN',
    slug: 'women',
    description: 'Elegant & Stylish Collection',
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
    link: '/shop/women',
  },
  {
    name: 'UNISEX',
    slug: 'unisex',
    description: 'Style For Everyone',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    link: '/shop/unisex',
  },
]
