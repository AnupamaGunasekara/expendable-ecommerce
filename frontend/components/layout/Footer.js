'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaTiktok, FaArrowRight } from 'react-icons/fa6';
import { useState } from 'react';
import { newsletterAPI } from '@/lib/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('LKR (₨)');

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
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Logo & Social */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <div className="text-4xl font-light tracking-widest">EXPENDABLES</div>
            </Link>
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                  <FaFacebook size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                  <FaInstagram size={20} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                  <FaYoutube size={20} />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                  <FaTiktok size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider">Sign Up For The FOA Newsletter</h3>
            <p className="text-sm text-gray-400 mb-6">
              Be the first to know about our new collections and promotions
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-0 bottom-3 text-white hover:text-gray-300 transition-colors disabled:opacity-50"
              >
                <FaArrowRight size={20} />
              </button>
            </form>
            {message && (
              <p className={`mt-2 text-xs ${message.includes('Success') ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}

            {/* Support & Info Columns */}
            <div className="grid grid-cols-2 gap-8 mt-12">
              {/* Support */}
              <div>
                <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Support</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms and Conditions</Link></li>
                  <li><Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/return-policy" className="text-gray-300 hover:text-white transition-colors">Return and Exchange Policy</Link></li>
                  <li><Link href="/shipping-policy" className="text-gray-300 hover:text-white transition-colors">Shipping Policy</Link></li>
                </ul>
              </div>

              {/* Info */}
              <div>
                <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Info</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">Our Story</Link></li>
                  <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <div className="bg-white rounded px-3 py-2 h-10 flex items-center">
              <span className="text-blue-600 font-bold text-xs">AMERICAN EXPRESS</span>
            </div>
            <div className="bg-white rounded px-3 py-2 h-10 flex items-center">
              <span className="text-black font-bold text-xs">Apple Pay</span>
            </div>
            <div className="bg-white rounded px-3 py-2 h-10 flex items-center">
              <span className="text-blue-700 font-bold text-xs">Diners Club</span>
            </div>
            <div className="bg-white rounded px-3 py-2 h-10 flex items-center">
              <span className="text-orange-600 font-bold text-xs">DISCOVER</span>
            </div>
            <div className="bg-white rounded px-3 py-2 h-10 flex items-center">
              <span className="font-bold text-xs">G Pay</span>
            </div>
            <div className="bg-white rounded px-3 py-2 h-10 flex items-center">
              <span className="text-red-600 font-bold text-xs">JCB</span>
            </div>
            <div className="bg-white rounded px-3 py-2 h-10 flex items-center">
              <span className="font-bold text-xs">Mastercard</span>
            </div>
            <div className="bg-white rounded px-3 py-2 h-10 flex items-center">
              <span className="text-blue-700 font-bold text-xs">Union Pay</span>
            </div>
            <div className="bg-white rounded px-3 py-2 h-10 flex items-center">
              <span className="text-blue-900 font-bold text-xs">VISA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-900">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent border border-gray-700 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-white"
              >
                <option value="LKR (₨)" className="bg-black">LKR (₨)</option>
                <option value="USD ($)" className="bg-black">USD ($)</option>
                <option value="EUR (€)" className="bg-black">EUR (€)</option>
              </select>
            </div>
            <p className="text-xs text-gray-400">
              © 2026 EXPENDABLES Clothing. All rights reserved. <Link href="https://shopify.com" className="hover:text-white transition-colors">Powered by Shopify</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
