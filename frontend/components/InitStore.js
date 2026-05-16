'use client'

import { useEffect } from 'react'
import { useWishlistStore } from '@/lib/store'

export default function InitStore() {
  const { init } = useWishlistStore()
  
  useEffect(() => {
    // Initialize wishlist from localStorage on app load
    init()
  }, [])
  
  return null
}
