import PolicyLayout from '@/components/PolicyLayout';

export default function PrivacyPolicy() {
  return (
    <PolicyLayout>
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <p className="text-gray-700">
          At EXPENDABLES, we are committed to protecting the privacy and security of our customers'
          personal information. This Privacy Policy outlines how we collect, use, and safeguard your
          information when you visit or make a purchase on our website. By using our website, you
          consent to the practices described in this policy.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="text-gray-700">
            When you visit our website, we may collect certain information about you, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              Personal identification information (such as your name, email address, and phone
              number) provided voluntarily by you during the registration or checkout process.
            </li>
            <li>
              Payment and billing information necessary to process your orders, including credit
              card details, which are securely handled by trusted third-party payment processors.
            </li>
            <li>
              Browsing information, such as your IP address, browser type, and device information,
              collected automatically using cookies and similar technologies.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Use of Information</h2>
          <p className="text-gray-700">
            We may use the collected information for the following purposes:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>To process and fulfill your orders, including shipping and delivery.</li>
            <li>
              To communicate with you regarding your purchases, provide customer support, and
              respond to inquiries or requests.
            </li>
            <li>
              To personalize your shopping experience and present relevant product recommendations
              and promotions.
            </li>
            <li>
              To improve our website, products, and services based on your feedback and browsing
              patterns.
            </li>
            <li>
              To detect and prevent fraud, unauthorized activities, and abuse of our website.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
          <p className="text-gray-700">
            We respect your privacy and do not sell, trade, or otherwise transfer your personal
            information to third parties without your consent, except in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <strong>Trusted service providers:</strong> We may share your information with
              third-party service providers who assist us in operating our website, processing
              payments, and delivering products. These providers are contractually obligated to
              handle your data securely and confidentially.
            </li>
            <li>
              <strong>Legal requirements:</strong> We may disclose your information if required to
              do so by law or in response to valid legal requests or orders.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="text-gray-700">
            We implement industry-standard security measures to protect your personal information
            from unauthorized access, alteration, disclosure, or destruction. However, please be
            aware that no method of transmission over the internet or electronic storage is 100%
            secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
          <p className="text-gray-700">
            We use cookies and similar technologies to enhance your browsing experience, analyze
            website traffic, and gather information about your preferences and interactions with our
            website. You have the option to disable cookies through your browser settings, but this
            may limit certain features and functionality of our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Changes to the Privacy Policy</h2>
          <p className="text-gray-700">
            We reserve the right to update or modify this Privacy Policy at any time. Any changes
            will be posted on this page with a revised "last updated" date. We encourage you to
            review this Privacy Policy periodically to stay informed about how we collect, use, and
            protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions, concerns, or requests regarding our Privacy Policy or the
            handling of your personal information, please contact us using the information provided
            on our website.
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
}
