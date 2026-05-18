import PolicyLayout from '@/components/PolicyLayout';

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout>
      <h1 className="text-4xl font-bold mb-8">Return & Exchange Policy</h1>
      
      <div className="prose max-w-none space-y-6">
          <h2 className="text-2xl font-bold">7-Day Return Policy</h2>
          <p>
            We want you to be completely satisfied with your purchase. If you're not happy with your 
            order, you can return or exchange it within 7 days of delivery.
          </p>

          <h3 className="text-xl font-bold mt-6">Return Conditions</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Items must be unused and in original condition</li>
            <li>All tags must be attached</li>
            <li>Original packaging must be intact</li>
            <li>Proof of purchase required</li>
          </ul>

          <h3 className="text-xl font-bold mt-6">How to Return</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Contact our support team at support@expendables.lk</li>
            <li>Provide your order number and reason for return</li>
            <li>Pack the item securely with original packaging</li>
            <li>Ship the item back to our returns address</li>
            <li>Refund will be processed within 5-7 business days</li>
          </ol>

          <h3 className="text-xl font-bold mt-6">Exchanges</h3>
          <p>
            We offer free exchanges for size and color changes. Simply follow the return process 
            and specify your exchange preference.
          </p>

          <h3 className="text-xl font-bold mt-6">Non-Returnable Items</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Sale items (unless defective)</li>
            <li>Customized products</li>
            <li>Items without tags</li>
          </ul>

          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mt-8">
            <h4 className="font-bold mb-2">Important Note</h4>
            <p>
              Return shipping costs are the customer's responsibility unless the item is defective 
              or we sent the wrong item.
            </p>
          </div>
        </div>
      </PolicyLayout>
  )
}
