import PolicyLayout from '@/components/PolicyLayout';

export default function TermsAndConditions() {
  return (
    <PolicyLayout>
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <p className="text-gray-700">
          Welcome to EXPENDABLES. These Terms and Conditions govern your use of our website and the
          purchase and sale of products from our platform. By accessing and using our website, you
          agree to comply with these terms. Please read them carefully before proceeding with any
          transactions.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Use of the Website</h2>
          <ul className="list-none text-gray-700 space-y-2">
            <li>a. You must be at least 18 years old to use our website or make purchases.</li>
            <li>
              b. You are responsible for maintaining the confidentiality of your account
              information, including your username and password.
            </li>
            <li>
              c. You agree to provide accurate and current information during the registration and
              checkout process.
            </li>
            <li>d. You may not use our website for any unlawful or unauthorized purposes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Product Information and Pricing</h2>
          <ul className="list-none text-gray-700 space-y-2">
            <li>
              a. We strive to provide accurate product descriptions, images, and pricing
              information. However, we do not guarantee the accuracy or completeness of such
              information.
            </li>
            <li>
              b. Prices are subject to change without notice. Any promotions or discounts are valid
              for a limited time and may be subject to additional terms and conditions.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Orders and Payments</h2>
          <ul className="list-none text-gray-700 space-y-2">
            <li>
              a. By placing an order on our website, you are making an offer to purchase the
              selected products.
            </li>
            <li>
              b. We reserve the right to refuse or cancel any order for any reason, including but
              not limited to product availability, errors in pricing or product information, or
              suspected fraudulent activity.
            </li>
            <li>
              c. You agree to provide valid and up-to-date payment information and authorize us to
              charge the total order amount, including applicable taxes and shipping fees, to your
              chosen payment method.
            </li>
            <li>
              d. We use trusted third-party payment processors to handle your payment information
              securely. We do not store or have access to your full payment details.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping and Delivery</h2>
          <ul className="list-none text-gray-700 space-y-2">
            <li>
              a. We will make reasonable efforts to ensure timely shipping and delivery of your
              orders.
            </li>
            <li>
              b. Shipping and delivery times provided are estimates and may vary based on your
              location and other factors.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Returns and Refunds</h2>
          <ul className="list-none text-gray-700 space-y-2">
            <li>
              a. Our Returns and Refund Policy governs the process and conditions for returning
              products and seeking refunds. Please refer to the policy provided on our website for
              more information.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
          <ul className="list-none text-gray-700 space-y-2">
            <li>
              a. All content and materials on our website, including but not limited to text,
              images, logos, and graphics, are protected by intellectual property rights and are
              the property of EXPENDABLES or its licensors.
            </li>
            <li>
              b. You may not use, reproduce, distribute, or modify any content from our website
              without our prior written consent.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
          <ul className="list-none text-gray-700 space-y-2">
            <li>
              a. In no event shall EXPENDABLES, its directors, employees, or affiliates be liable
              for any direct, indirect, incidental, special, or consequential damages arising out
              of or in connection with your use of our website or the purchase and use of our
              products.
            </li>
            <li>
              b. We make no warranties or representations, express or implied, regarding the
              quality, accuracy, or suitability of the products offered on our website.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Amendments and Termination</h2>
          <p className="text-gray-700">
            We reserve the right to modify, update, or terminate these Terms and Conditions at any
            time without prior notice. It is your responsibility to review these terms periodically
            for any changes.
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
}
