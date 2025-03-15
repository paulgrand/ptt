'use client';

import HotelResult from "@/components/HotelResult";
import { useState, useEffect, use } from 'react';

type SortOption = 'price-asc' | 'price-desc' | 'dog-friendly-price' | 'rating';

type ResultsClientProps = {
  location: string;
  startDate: string;
  endDate: string;
  lat: string;
  lng: string;
};

export default function ResultsClient({ location, startDate, endDate, lat, lng }: ResultsClientProps) {
  const [sortOption, setSortOption] = useState<SortOption>('dog-friendly-price');
  const [data, setData] = useState([]);
  const [dogFriendlyHotels, setDogFriendlyHotels] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const protocol = window.location.protocol;
        const host = window.location.host;
        
        // Fetch both hotel data and dog-friendly data in parallel
        const [hotelResponse, dogFriendlyResponse] = await Promise.all([
          fetch(
            `${protocol}//${host}/api/search?location=${location}&lat=${lat}&lng=${lng}&startDate=${startDate}&endDate=${endDate}`,
            { cache: "no-store" }
          ),
          fetch(`${protocol}//${host}/api/dog-friendly`)
        ]);

        if (!hotelResponse.ok || !dogFriendlyResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const hotelData = await hotelResponse.json();
        const dogFriendlyData = await dogFriendlyResponse.json();

        setData(hotelData);
        // Convert the plain object back to a Map
        setDogFriendlyHotels(new Map(Object.entries(dogFriendlyData)));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [location, lat, lng, startDate, endDate]);

  
  const sortData = (data) => {
    return [...data].sort((a, b) => {
      const aIsDogFriendly = dogFriendlyHotels.has(a.hotelId);
      const bIsDogFriendly = dogFriendlyHotels.has(b.hotelId);
      
      const getLowestPrice = (offers) => {
        if (!offers || !offers.length) return Infinity;
        return Math.min(...offers.map(offer => parseFloat(offer.price.total)));
      };
    
      const priceA = getLowestPrice(a.offers);
      const priceB = getLowestPrice(b.offers);

      switch (sortOption) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'dog-friendly-price':
          if (aIsDogFriendly !== bIsDogFriendly) {
            return aIsDogFriendly ? -1 : 1;
          }
          return priceA - priceB;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
  };

  if (isLoading) {
    return <div className="p-6 max-w-3xl mx-auto">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-xl font-bold text-red-500">Error</h1>
        <p>Failed to fetch search results.</p>
      </div>
    );
  }
  
  const sortedData = sortData(data);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hotel Search Results</h1>
      <p className="text-sm text-gray-600 mb-6">
        Showing results for <strong>{decodeURIComponent(location)}</strong> from{" "}
        <strong>{startDate}</strong> to <strong>{endDate}</strong>.
      </p>

      <div style={{backgroundColor:"#f0e7c5"}} className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="dog-friendly-price">Dog Friendly & Price ↑</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {sortedData?.length > 0 ? (
        <ul className="space-y-4">
        {
          // console.log(sortedData);
        sortedData.map((result) => (
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