# EXPENDABLES - Modern Fashion Ecommerce Platform

A complete full-stack ecommerce application for EXPENDABLES, a Sri Lankan lifestyle clothing brand specializing in premium T-shirts.

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT-based authentication
- **Payment**: Cash on Delivery + Card payment placeholder
- **Styling**: Tailwind CSS

## Features

### Customer Features
- Browse T-shirts by category (Men, Women, Unisex)
- Advanced filtering (price, size, color, category)
- Product search functionality
- Shopping cart with session persistence
- User authentication and account management
- Wishlist functionality
- Secure checkout process
- Order tracking
- Multiple payment methods (COD, Card placeholder)
- Responsive design (mobile-first)

### Admin Features
- Secure admin dashboard
- Product management (CRUD operations)
- Order management
- Customer management
- Stock management
- Coupon management
- Content management (banners, announcements)

## Project Structure

```
expendables/
├── frontend/                    # Next.js frontend application
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (auth)/            # Auth routes group
│   │   ├── (shop)/            # Shop routes group
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes for backend proxy
│   │   ├── layout.js          # Root layout
│   │   └── page.js            # Home page
│   ├── components/            # Reusable React components
│   │   ├── layout/           # Header, Footer
│   │   ├── product/          # Product cards, grids
│   │   ├── cart/             # Cart components
│   │   ├── admin/            # Admin components
│   │   └── common/           # Shared components
│   ├── lib/                   # Utilities and helpers
│   ├── styles/                # Global styles
│   ├── public/                # Static assets
│   └── package.json
├── backend/                    # Express.js backend API
│   ├── controllers/           # Route controllers
│   ├── routes/                # API routes
│   ├── middleware/            # Express middleware
│   ├── config/                # Configuration files
│   ├── utils/                 # Utility functions
│   ├── prisma/                # Prisma schema and migrations
│   └── package.json
├── .env.example               # Environment variables template
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+
- Git

## Installation & Setup

### 1. Clone the Repository

```bash
cd /Users/anupamagunasekara/EXPENDABLE
```

### 2. Set Up MySQL Database

Create a new MySQL database:

```sql
CREATE DATABASE expendables_db;
CREATE USER 'expendables_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON expendables_db.* TO 'expendables_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp ../.env.example .env

# Update .env with your database credentials
# Edit .env file with your actual values

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed sample data
npx prisma db seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5030`

### 4. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5030/api" > .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 5. Access the Application

- **Customer Site**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

**Default Admin Credentials:**
- Email: admin@expendables.com
- Password: Admin@123

**Test Customer Account:**
- Email: customer@test.com
- Password: Customer@123

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5030
NODE_ENV=development

# Database
DATABASE_URL="mysql://expendables_user:your_password@localhost:3306/expendables_db"

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_NAME=EXPENDABLES
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `GET /api/admin/orders` - Get all orders (admin)
- `PUT /api/admin/orders/:id` - Update order status (admin)

### Coupons
- `POST /api/coupons/validate` - Validate coupon code
- `GET /api/admin/coupons` - Get all coupons (admin)
- `POST /api/admin/coupons` - Create coupon (admin)

### Contact & Newsletter
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter` - Subscribe to newsletter

## Development Commands

### Backend

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run migrate      # Run Prisma migrations
npm run seed         # Seed database
npm run studio       # Open Prisma Studio
```

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Database Schema

Key tables:
- **users** - Customer accounts
- **admin_users** - Admin accounts
- **products** - Product catalog
- **product_images** - Product image gallery
- **product_variants** - Size/color variants with stock
- **categories** - Product categories
- **carts** & **cart_items** - Shopping cart
- **orders** & **order_items** - Order management
- **wishlist** - Customer wishlist
- **coupons** - Discount coupons
- **newsletter_subscribers** - Email subscribers
- **contact_messages** - Contact form submissions

## Deployment

### Production Build

```bash
# Backend
cd backend
npm install --production
npx prisma migrate deploy
npm start

# Frontend
cd frontend
npm run build
npm start
```

### Environment Variables for Production

Make sure to update:
- `NODE_ENV=production`
- Strong `JWT_SECRET`
- Secure database credentials
- HTTPS URLs
- Remove default admin password

## Features to Implement (Future)

- [ ] Email notifications (order confirmations)
- [ ] SMS notifications for delivery
- [ ] Real payment gateway integration (Stripe, PayHere)
- [ ] Product reviews and ratings
- [ ] Size guide with measurements
- [ ] Advanced analytics dashboard
- [ ] Inventory alerts
- [ ] Multi-image upload with optimization
- [ ] Social media authentication
- [ ] Gift cards and store credit
- [ ] Referral program

## Security Best Practices

- All passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected API routes with middleware
- Input validation and sanitization
- SQL injection prevention (Prisma)
- XSS protection
- CORS configuration
- Environment variables for sensitive data

## Support

For issues and questions:
- Email: support@expendables.com
- Phone: +94 XX XXX XXXX

## License

© 2026 EXPENDABLES. All Rights Reserved.

## Credits

Developed with ❤️ for EXPENDABLES - Sri Lankan Lifestyle Fashion Brand
