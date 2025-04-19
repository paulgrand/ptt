// components/PaymentPlaceholder.tsx
interface PaymentPlaceholderProps {
  onPaymentComplete: () => void;
}

export default function PaymentPlaceholder({ onPaymentComplete }: PaymentPlaceholderProps) {
  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 border border-dashed border-gray-300 rounded">
          <p className="text-gray-600">Payment integration coming soon...</p>
        </div>
        
        <button
          onClick={onPaymentComplete}
          className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-800 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
            transition duration-150 ease-in-out"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
