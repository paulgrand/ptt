// components/BookingComplete.tsx
import { useRouter } from 'next/navigation';

interface BookingCompleteProps {
  bookingDetails?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    bookingReference?: string;
  };
}

export default function BookingComplete({ bookingDetails }: BookingCompleteProps) {
  const router = useRouter();
  const bookingReference = bookingDetails?.bookingReference || 'BOK' + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">Thank you for your reservation</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking Reference:</span>
            <span className="font-medium">{bookingReference}</span>
          </div>
          {bookingDetails?.firstName && (
            <div className="flex justify-between">
              <span className="text-gray-600">Guest Name:</span>
              <span className="font-medium">
                {bookingDetails.firstName} {bookingDetails.lastName}
              </span>
            </div>
          )}
          {bookingDetails?.email && (
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{bookingDetails.email}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => router.push('/')}
          className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-800 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
            transition duration-150 ease-in-out"
        >
          Return to Search
        </button>
        
        <button
          onClick={() => window.print()}
          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md 
            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Print Confirmation
        </button>
      </div>
    </div>
  );
}
