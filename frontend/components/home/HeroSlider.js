'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function HeroSlider({ slides = defaultSlides }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center text-white">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fadeIn">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 animate-fadeIn animation-delay-200">
                {slide.subtitle}
              </p>
              <Link href={slide.link}>
                <button className="btn-primary animate-fadeIn animation-delay-400">
                  {slide.buttonText}
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all z-10"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={24} className="text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all z-10"
        aria-label="Next slide"
      >
        <FiChevronRight size={24} className="text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

const defaultSlides = [
  {
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1920&q=80',
    title: 'NEW COLLECTION',
    subtitle: 'Explore our latest designs built for everyday style',
    buttonText: 'Shop Now',
    link: '/shop/new',
  },
  {
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1920&q=80',
    title: 'SUMMER SALE',
    subtitle: 'Up to 50% off on selected items',
    buttonText: 'View Sale',
    link: '/shop/sale',
  },
  {
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1920&q=80',
    title: 'PREMIUM QUALITY',
    subtitle: 'Crafted with the finest materials for ultimate comfort',
    buttonText: 'Discover More',
    link: '/shop/all',
  },
]
