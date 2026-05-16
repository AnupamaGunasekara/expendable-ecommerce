# EXPENDABLES - Quick Start Guide

## 🎯 What's Been Created

### ✅ Complete Backend (100%)
- Full Express.js REST API with all endpoints
- MySQL database schema with Prisma ORM
- JWT authentication for users and admins
- Product, Cart, Order, Wishlist, Coupon management
- Admin dashboard APIs
- Database seeding with sample products

### ✅ Frontend Foundation (40%)
- Next.js 14 App Router setup
- Tailwind CSS configured
- API client with axios
- Zustand store for state management
- Header and Footer components
- Cart drawer component
- Home page structure

## 🚀 Quick Setup (5 Minutes)

### 1. Install Dependencies

```bash
# Make setup script executable
chmod +x setup.sh

# Run setup (will guide you through everything)
./setup.sh
```

### 2. Manual Setup (if script doesn't work)

**Backend:**
```bash
cd backend
npm install
cp ../.env.example .env
# Edit .env with your MySQL credentials
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5030/api" > .env.local
npm run dev
```

### 3. Access the Application

- **Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API**: http://localhost:5030/api

**Default Credentials:**
- Admin: `admin@expendables.com` / `Admin@123`
- Customer: `customer@test.com` / `Customer@123`

## 📁 Complete File Structure Created

```
EXPENDABLE/
├── backend/
│   ├── package.json ✅
│   ├── server.js ✅
│   ├── prisma/
│   │   ├── schema.prisma ✅
│   │   └── seed.js ✅
│   ├── config/
│   │   ├── database.js ✅
│   │   └── jwt.js ✅
│   ├── middleware/
│   │   ├── auth.middleware.js ✅
│   │   └── validation.middleware.js ✅
│   ├── controllers/
│   │   ├── auth.controller.js ✅
│   │   ├── product.controller.js ✅
│   │   ├── category.controller.js ✅
│   │   ├── cart.controller.js ✅
│   │   ├── wishlist.controller.js ✅
│   │   ├── order.controller.js ✅
│   │   ├── coupon.controller.js ✅
│   │   ├── contact.controller.js ✅
│   │   ├── newsletter.controller.js ✅
│   │   ├── settings.controller.js ✅
│   │   └── admin.controller.js ✅
│   └── routes/
│       ├── auth.routes.js ✅
│       ├── product.routes.js ✅
│       ├── category.routes.js ✅
│       ├── cart.routes.js ✅
│       ├── wishlist.routes.js ✅
│       ├── order.routes.js ✅
│       ├── coupon.routes.js ✅
│       ├── contact.routes.js ✅
│       ├── newsletter.routes.js ✅
│       ├── settings.routes.js ✅
│       └── admin.routes.js ✅
│
├── frontend/
│   ├── package.json ✅
│   ├── next.config.js ✅
│   ├── tailwind.config.js ✅
│   ├── postcss.config.js ✅
│   ├── app/
│   │   ├── globals.css ✅
│   │   ├── layout.js ✅
│   │   └── page.js ✅
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.js ✅
│   │   │   └── Footer.js ✅
│   │   └── cart/
│   │       └── CartDrawer.js ✅
│   └── lib/
│       ├── api.js ✅
│       ├── store.js ✅
│       └── utils.js ✅
│
├── README.md ✅
├── .env.example ✅
├── setup.sh ✅
└── QUICKSTART.md ✅ (this file)
```

## 🔨 Components You Need to Create

### Priority 1: Essential Components (Build These First)

#### 1. Product Components

**frontend/components/product/ProductCard.js**
```jsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, getProductBadge } from '@/lib/utils';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';

export default function ProductCard({ product }) {
  const badge = getProductBadge(product);
  const price = product.salePrice || product.price;

  return (
    <div className="group product-card">
      <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-100">
        {product.images?.[0] && (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {badge && (
          <span className={`absolute top-2 left-2 ${badge.color} text-white text-xs px-2 py-1 rounded`}>
            {badge.text}
          </span>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
            <FiHeart size={18} />
          </button>
        </div>
      </div>
      <Link href={`/products/${product.slug}`}>
        <h3 className="font-medium mb-1 hover:underline">{product.name}</h3>
      </Link>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold">{formatPrice(price)}</span>
        {product.salePrice && (
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(product.price)}
          </span>
        )}
      </div>
      <button className="w-full btn btn-primary">
        <FiShoppingBag className="mr-2" />
        Add to Cart
      </button>
    </div>
  );
}
```

**frontend/components/product/ProductGrid.js**
```jsx
import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### 2. Home Page Components

**frontend/components/home/HeroSlider.js**
```jsx
'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Link from 'next/link';

export default function HeroSlider() {
  const slides = [
    {
      title: 'Printed Tee Collection',
      subtitle: 'Express yourself with bold designs',
      cta: 'Shop Now',
      href: '/shop/men-printed',
      bg: 'bg-gradient-to-r from-blue-500 to-purple-600',
    },
    {
      title: 'Oversized Tee Collection',
      subtitle: 'Ultimate comfort meets style',
      cta: 'Explore',
      href: '/shop/oversized',
      bg: 'bg-gradient-to-r from-gray-800 to-gray-600',
    },
    {
      title: 'Unisex Streetwear',
      subtitle: 'Fashion for everyone',
      cta: 'Discover',
      href: '/shop/unisex',
      bg: 'bg-gradient-to-r from-green-500 to-teal-600',
    },
  ];

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{ delay: 5000 }}
      pagination={{ clickable: true }}
      navigation
      className="h-[60vh] md:h-[70vh]"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className={`${slide.bg} h-full flex items-center justify-center text-white`}>
            <div className="text-center max-w-4xl px-4">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
              <Link href={slide.href} className="btn bg-white text-black hover:bg-gray-200">
                {slide.cta}
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
```

**frontend/components/home/CategoryTiles.js**
```jsx
import Link from 'next/link';
import Image from 'next/image';

export default function CategoryTiles() {
  const categories = [
    { name: 'Men T-Shirts', href: '/shop/men', image: 'https://placehold.co/600x800/333/FFF?text=Men' },
    { name: 'Women T-Shirts', href: '/shop/women', image: 'https://placehold.co/600x800/666/FFF?text=Women' },
    { name: 'Unisex T-Shirts', href: '/shop/unisex', image: 'https://placehold.co/600x800/999/FFF?text=Unisex' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.href} href={category.href} className="group">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
              <h3 className="text-white text-3xl font-bold">{category.name}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

**frontend/components/home/NewsletterSection.js**
```jsx
'use client';
import { useState } from 'react';
import { newsletterAPI } from '@/lib/api';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await newsletterAPI.subscribe(email);
      setMessage('Successfully subscribed!');
      setEmail('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          SIGN UP FOR OUR NEWSLETTER
        </h2>
        <p className="text-gray-400 mb-8">
          Be the first to know about new drops, offers, and exclusive releases.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-md text-black"
          />
          <button type="submit" disabled={loading} className="btn bg-white text-black hover:bg-gray-200">
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </section>
  );
}
```

#### 3. Search Component

**frontend/components/search/SearchOverlay.js**
```jsx
'use client';
import { useState, useEffect } from 'react';
import { useUIStore } from '@/lib/store';
import { FiX, FiSearch } from 'react-icons/fi';
import { productAPI } from '@/lib/api';
import Link from 'next/link';
import { debounce } from '@/lib/utils';

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = debounce(async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await productAPI.search(searchQuery);
      setResults(response.data.products || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    searchProducts(query);
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              autoFocus
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-black rounded-lg focus:outline-none"
            />
          </div>
          <button onClick={closeSearch} className="p-2">
            <FiX size={24} />
          </button>
        </div>

        {loading && <p className="text-center text-gray-500">Searching...</p>}

        {results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={closeSearch}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-medium mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600">Rs. {product.price}</p>
              </Link>
            ))}
          </div>
        )}

        {query.length >= 2 && !loading && results.length === 0 && (
          <p className="text-center text-gray-500">No products found</p>
        )}
      </div>
    </div>
  );
}
```

### Priority 2: Page Routes to Create

Create these page files in `frontend/app/`:

#### Authentication Pages
- `app/login/page.js` - Login form
- `app/register/page.js` - Registration form
- `app/account/page.js` - User dashboard
- `app/account/orders/page.js` - Order history
- `app/account/addresses/page.js` - Manage addresses

#### Shop Pages
- `app/shop/[category]/page.js` - Shop listing with filters
- `app/products/[slug]/page.js` - Product detail page

#### Cart & Checkout
- `app/cart/page.js` - Full cart page
- `app/checkout/page.js` - Checkout process

#### Information Pages
- `app/about/page.js`
- `app/contact/page.js`
- `app/faq/page.js`
- `app/shipping-policy/page.js`
- `app/return-policy/page.js`
- `app/privacy-policy/page.js`
- `app/terms/page.js`
- `app/careers/page.js`

#### Admin Pages
- `app/admin/layout.js` - Admin layout
- `app/admin/page.js` - Admin dashboard
- `app/admin/products/page.js` - Product management
- `app/admin/orders/page.js` - Order management
- `app/admin/customers/page.js` - Customer list
- `app/admin/coupons/page.js` - Coupon management

## 🎨 Design Guidelines

### Colors
- Primary: Black (#000000)
- Secondary: White (#FFFFFF)
- Accent: Gray shades
- Sale: Red (#EF4444)
- New: Green (#10B981)

### Typography
- Font: Inter (Google Font)
- Headings: Bold, large
- Body: Regular weight

### Spacing
- Use Tailwind spacing utilities
- Standard padding: px-4 sm:px-6 lg:px-8
- Max width: max-w-8xl (1440px)

## 🔥 Features Implemented

### Backend API (Complete)
✅ User authentication & JWT
✅ Product CRUD with variants
✅ Category management
✅ Shopping cart (session & user)
✅ Wishlist
✅ Order processing
✅ Coupon system
✅ Admin dashboard APIs
✅ Contact form
✅ Newsletter subscription

### Frontend (Partial - 40%)
✅ Next.js 14 setup
✅ Tailwind CSS
✅ API integration
✅ State management (Zustand)
✅ Header & Footer
✅ Cart drawer
✅ Home page structure
⏳ Shop pages
⏳ Product detail page
⏳ Checkout flow
⏳ User account pages
⏳ Admin dashboard UI

## 📝 Next Steps

1. **Install & Run** (see Quick Setup above)
2. **Create remaining components** using the templates above
3. **Build shop pages** with filters and sorting
4. **Implement checkout** flow
5. **Create admin UI** for product management
6. **Test all features** thoroughly
7. **Deploy to production**

## 🐛 Troubleshooting

### Database Connection Error
- Check MySQL is running: `mysql.server start` (Mac) or `sudo service mysql start` (Linux)
- Verify credentials in `backend/.env`
- Ensure database exists

### Port Already in Use
- Backend: Change PORT in `backend/.env`
- Frontend: Run `npm run dev -- -p 3001`

### Prisma Errors
```bash
cd backend
npx prisma generate
npx prisma migrate reset
npx prisma db seed
```

### Module Not Found
```bash
# Clear caches and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Prisma**: https://www.prisma.io/docs
- **Express.js**: https://expressjs.com

## 🎯 Production Deployment

### Environment Variables (Production)
```env
# Backend
NODE_ENV=production
DATABASE_URL="your-production-db-url"
JWT_SECRET="long-random-secure-string"
FRONTEND_URL="https://yourdomain.com"

# Frontend
NEXT_PUBLIC_API_URL="https://api.yourdomain.com/api"
```

### Deployment Platforms
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, DigitalOcean
- **Database**: PlanetScale, Railway, AWS RDS

## 💬 Support

For questions or issues:
1. Check this guide first
2. Review the README.md
3. Check backend API logs
4. Test endpoints with Postman/Thunder Client

---

**Built with ❤️ for EXPENDABLES**
