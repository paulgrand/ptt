import HotelResult from "@/components/HotelResult";
import { getDogFriendlyHotels } from '@/utils/csvParser';
import { headers } from 'next/headers';

export default async function ResultsPage({ params }) {
  // Ensure params is awaited
  const { location, startDate, endDate, lat, lng } = await params;

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';


  const dogFriendlyHotels = getDogFriendlyHotels();
  
  // Fetch data from your API
  // const response = await fetch(
  //   `http://localhost:3000/api/search?location=${location}&lat=${lat}&lng=${lng}&startDate=${startDate}&endDate=${endDate}`,
  //   { cache: "no-store" } // Avoid caching if necessary
  // );
  const response = await fetch(
    `${protocol}://${host}/api/search?location=${location}&lat=${lat}&lng=${lng}&startDate=${startDate}&endDate=${endDate}`,
    { cache: "no-store" }
  );

  if (!response?.ok) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-xl font-bold text-red-500">Error</h1>
        <p>Failed to fetch search results.</p>
      </div>
    );
  }

  const data = await response.json();

  const sortedData = [...data].sort((a, b) => {
    const aIsDogFriendly = dogFriendlyHotels.has(a.hotelId);
    const bIsDogFriendly = dogFriendlyHotels.has(b.hotelId);
    
    if (aIsDogFriendly && !bIsDogFriendly) return -1;
    if (!aIsDogFriendly && bIsDogFriendly) return 1;
    
    // If both hotels have the same dog-friendly status,
    // maintain the original distance-based sorting
    return a.distance.value - b.distance.value;
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hotel Search Results</h1>
      <p className="text-sm text-gray-600 mb-6">
        Showing results for <strong>{decodeURIComponent(location)}</strong> from{" "}
        <strong>{startDate}</strong> to <strong>{endDate}</strong>.
      </p>
      {sortedData?.length > 0 ? (
        <ul className="space-y-4">

        {sortedData.map((result) => (
          <HotelResult 
            key={result.hotelId} 
            result={result} 
            location={location}
            isDogFriendly={dogFriendlyHotels.has(result.hotelId)}
            dogFriendlyInfo={dogFriendlyHotels.get(result.hotelId)}
          />
        ))}
        </ul>
      ) : (
        <p className="text-gray-600">No results found.</p>
      )}
    </div>
  );
}