import PolicyLayout from '@/components/PolicyLayout';

export default function TermsAndConditions() {
  return (
    <PolicyLayout>
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      
      <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-700">
              Welcome to EXPENDABLES. These terms and conditions outline the rules and regulations for the use of EXPENDABLES's website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Agreement to Terms</h2>
            <p className="text-gray-700">
              By accessing this website, we assume you accept these terms and conditions. Do not continue to use EXPENDABLES if you do not agree to all of the terms and conditions stated on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Products and Services</h2>
            <p className="text-gray-700">
              All products and services are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Orders and Payment</h2>
            <p className="text-gray-700">
              We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700">
              All content on this website, including text, graphics, logos, and images, is the property of EXPENDABLES and protected by copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700">
              EXPENDABLES shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms and Conditions, please contact us through our contact page.
            </p>
          </section>
        </div>
      </PolicyLayout>
  );
}
