'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PolicyLayout({ children }) {
  const pathname = usePathname();

  const policyLinks = [
    { name: 'Terms and Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Return and Exchange Policy', href: '/return-policy' },
    { name: 'Shipping Policy', href: '/shipping-policy' },
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Vertical Navigation - Left Side */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Policies
              </h3>
              <nav className="space-y-2">
                {policyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                      pathname === link.href
                        ? 'bg-black text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 lg:pl-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
