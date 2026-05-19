'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import { useCartStore, useAuthStore, useUIStore } from '@/lib/store';
import { settingsAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, toggleSearch } = useUIStore();
  const [announcements, setAnnouncements] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoImage, setLogoImage] = useState(null);

  useEffect(() => {
    // Fetch announcements
    settingsAPI.getByKey('announcement_bar')
      .then(res => setAnnouncements(res.data.value || []))
      .catch(() => {});

    // Fetch logo image
    settingsAPI.getByKey('logo_image')
      .then(res => {
        if (res.data.value) {
          setLogoImage(res.data.value);
        }
      })
      .catch(() => {});

    // Handle scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Men', href: '/shop/men' },
    { name: 'Women', href: '/shop/women' },
    { name: 'Unisex', href: '/shop/unisex' },
    { name: 'New Collection', href: '/shop/new' },
    { name: 'Sale', href: '/shop/sale' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      {announcements.length > 0 && (
        <div className="bg-black text-white py-2 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...announcements, ...announcements].map((text, index) => (
              <span key={index} className="mx-8 text-sm font-medium">
                {text}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-700 hover:text-black"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Desktop Navigation - Left aligned */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    link.name === 'Sale' 
                      ? 'text-red-600 hover:text-red-700 font-bold' 
                      : pathname === link.href 
                      ? 'text-black' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Logo - Centered */}
            <Link href="/" className="flex items-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
              {logoImage?.url ? (
                <Image
                  src={getImageUrl(logoImage.url)}
                  alt={logoImage.alt || 'EXPENDABLES'}
                  width={150}
                  height={50}
                  className="h-10 md:h-12 w-auto object-contain"
                  priority
                />
              ) : (
                <span className="text-2xl md:text-3xl font-bold tracking-wider">
                 
                </span>
              )}
            </Link>

            {/* Icons - Right aligned */}
            <div className="flex items-center space-x-4 lg:flex-1 lg:justify-end">
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-700 hover:text-black transition-colors"
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>
              
              <Link
                href={isAuthenticated ? '/account' : '/login'}
                className="hidden sm:block p-2 text-gray-700 hover:text-black transition-colors"
                aria-label="Account"
              >
                <FiUser size={20} />
              </Link>
              
              {isAuthenticated && (
                <Link
                  href="/wishlist"
                  className="p-2 text-gray-700 hover:text-black transition-colors"
                  aria-label="Wishlist"
                >
                  <FiHeart size={20} />
                </Link>
              )}
              
              <button
                onClick={openCart}
                className="relative p-2 text-gray-700 hover:text-black transition-colors"
                aria-label="Cart"
              >
                <FiShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 animate-fade-in">
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                    link.name === 'Sale'
                      ? 'text-red-600 hover:bg-red-50 font-bold'
                      : pathname === link.href
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href={isAuthenticated ? '/account' : '/login'}
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  {isAuthenticated ? 'My Account' : 'Login / Register'}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
