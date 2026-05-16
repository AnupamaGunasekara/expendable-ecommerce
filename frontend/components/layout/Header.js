'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import { useCartStore, useAuthStore, useUIStore } from '@/lib/store';
import { settingsAPI } from '@/lib/api';

export default function Header() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, toggleSearch } = useUIStore();
  const [announcements, setAnnouncements] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Fetch announcements
    settingsAPI.getByKey('announcement_bar')
      .then(res => setAnnouncements(res.data.value || []))
      .catch(() => {});

    // Handle scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Men', href: '/shop/men' },
    { name: 'Women', href: '/shop/women' },
    { name: 'Unisex', href: '/shop/unisex' },
    { name: 'New Collection', href: '/shop/new' },
    { name: 'Sale', href: '/shop/sale' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
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
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-700 hover:text-black"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="text-2xl md:text-3xl font-bold tracking-wider">
              EXPENDABLES
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    pathname === link.href ? 'text-black' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
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
                  className="hidden sm:block p-2 text-gray-700 hover:text-black transition-colors"
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
                    pathname === link.href
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
