export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">About EXPENDABLES</h1>
        
        <div className="prose max-w-none space-y-6">
          <p className="text-lg text-gray-600">
            EXPENDABLES is Sri Lanka's premium streetwear brand, dedicated to bringing you bold, 
            fearless fashion that's built for everyday style.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Story</h2>
          <p>
            Founded with a passion for quality and design, EXPENDABLES has become synonymous with 
            premium T-shirts that combine comfort, style, and durability. We believe that fashion 
            should be accessible, sustainable, and expressive.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p>
            To provide high-quality, stylish apparel that empowers individuals to express themselves 
            confidently. We're committed to sustainable practices and ethical manufacturing.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Premium quality fabrics</li>
            <li>Unique, bold designs</li>
            <li>Perfect fit guaranteed</li>
            <li>Fast, reliable delivery across Sri Lanka</li>
            <li>Excellent customer service</li>
            <li>Easy returns and exchanges</li>
          </ul>

          <div className="bg-gray-100 p-8 rounded-lg mt-12">
            <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
            <p className="mb-4">Have questions? We'd love to hear from you.</p>
            <a href="/contact" className="btn-primary inline-block">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
