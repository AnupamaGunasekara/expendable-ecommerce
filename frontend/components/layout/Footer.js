'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { useState } from 'react';
import { newsletterAPI } from '@/lib/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await newsletterAPI.subscribe(email);
      setMessage('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">SIGN UP FOR OUR NEWSLETTER</h3>
            <p className="text-gray-400 mb-6">
              Be the first to know about new drops, offers, and exclusive EXPENDABLES releases.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {message && (
              <p className={`mt-4 text-sm ${message.includes('Success') ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h4 className="text-lg font-bold mb-4">EXPENDABLES</h4>
            <p className="text-gray-400 text-sm mb-4">
              Sri Lankan lifestyle fashion brand delivering premium T-shirts designed for everyday style and comfort.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube size={20} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaTiktok size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-lg font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop/men" className="text-gray-400 hover:text-white transition-colors">Men T-Shirts</Link></li>
              <li><Link href="/shop/women" className="text-gray-400 hover:text-white transition-colors">Women T-Shirts</Link></li>
              <li><Link href="/shop/unisex" className="text-gray-400 hover:text-white transition-colors">Unisex T-Shirts</Link></li>
              <li><Link href="/shop/new" className="text-gray-400 hover:text-white transition-colors">New Collection</Link></li>
              <li><Link href="/shop/sale" className="text-gray-400 hover:text-white transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/shipping-policy" className="text-gray-400 hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="text-gray-400 hover:text-white transition-colors">Return & Exchange</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/account" className="text-gray-400 hover:text-white transition-colors">My Account</Link></li>
            </ul>
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">We Accept</p>
              <div className="flex flex-wrap gap-2">
                <div className="bg-white px-2 py-1 rounded text-xs text-black font-medium">VISA</div>
                <div className="bg-white px-2 py-1 rounded text-xs text-black font-medium">MASTERCARD</div>
                <div className="bg-white px-2 py-1 rounded text-xs text-black font-medium">AMEX</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-400">
            © 2026 EXPENDABLES. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
