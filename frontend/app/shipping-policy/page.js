import PolicyLayout from '@/components/PolicyLayout';

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout>
      <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
      
      <div className="prose max-w-none space-y-6">
          <h2 className="text-2xl font-bold">Shipping Information</h2>
          <p>We deliver across Sri Lanka with reliable shipping partners.</p>

          <h3 className="text-xl font-bold mt-6">Shipping Costs</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Free Shipping:</strong> On orders over Rs. 9,999</li>
            <li><strong>Standard Delivery:</strong> Rs. 500 (3-5 business days)</li>
          </ul>

          <h3 className="text-xl font-bold mt-6">Delivery Areas</h3>
          <p>We currently ship to all areas within Sri Lanka including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Colombo & Western Province</li>
            <li>All major cities and towns</li>
            <li>Remote areas (may take additional time)</li>
          </ul>

          <h3 className="text-xl font-bold mt-6">Processing Time</h3>
          <p>
            Orders are processed within 1-2 business days. You will receive a tracking number 
            once your order is shipped.
          </p>

          <h3 className="text-xl font-bold mt-6">Tracking Your Order</h3>
          <p>
            Once your order is shipped, you'll receive an email with tracking information. 
            You can also track your order from your account dashboard.
          </p>

          <div className="bg-gray-100 p-6 rounded-lg mt-8">
            <h4 className="font-bold mb-2">Need Help?</h4>
            <p>Contact our support team at <a href="mailto:support@expendables.lk" className="text-primary">support@expendables.lk</a></p>
          </div>
        </div>
      </PolicyLayout>
  )
}
