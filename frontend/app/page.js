import Link from 'next/link';
import { productAPI, settingsAPI } from '@/lib/api';
import HeroSlider from '@/components/home/HeroSlider';
import ProductGrid from '@/components/product/ProductGrid';
import CategoryTiles from '@/components/home/CategoryTiles';
import NewsletterSection from '@/components/home/NewsletterSection';

export const revalidate = 3600; // Revalidate every hour

async function getFeaturedProducts() {
  try {
    const response = await productAPI.getFeatured();
    return response.data.products || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <section className="w-full">
        <HeroSlider />
      </section>

      {/* New Collection */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">NEW COLLECTION</h2>
          <p className="text-gray-600">Fresh drops from EXPENDABLES</p>
        </div>
        <ProductGrid products={featuredProducts.slice(0, 8)} />
        <div className="text-center mt-12">
          <Link href="/shop/new" className="btn btn-primary">
            View All New Arrivals
          </Link>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CategoryTiles />
      </section>

      {/* Campaign Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            BUILT FOR EVERYDAY STYLE
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore premium streetwear T-shirts made for comfort, confidence, and movement.
          </p>
          <Link href="/shop" className="btn btn-primary">
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">BEST SELLERS</h2>
          <p className="text-gray-600">Shop our most wanted T-shirts</p>
        </div>
        <ProductGrid products={featuredProducts.slice(8, 16)} />
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
