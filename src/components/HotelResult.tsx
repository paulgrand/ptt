"use client";
import { useState, useEffect } from 'react';
import { FaPaw } from 'react-icons/fa';
import { FaBuilding } from 'react-icons/fa';


const formatHotelName = (name: string): string => {
  const abbreviations = ['me', 'nyc', 'sq', 'uk', 'usa', 'w',];
  const minorWords = ['le', 'la', 'de', 'du', 'des', 'and', 'in', 'on', 'at', 'by'];
  
  return name
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // Keep abbreviations in uppercase
      if (abbreviations.includes(word)) return word.toUpperCase();
      
      // Keep minor words lowercase unless they're the first word
      if (minorWords.includes(word) && index !== 0) return word;
      
      // Handle hyphenated words
      if (word.includes('-')) {
        return word
          .split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join('-');
      }
      
      // Capitalize first letter of other words
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export default function HotelResult ({ result, location, isDogFriendly, dogFriendlyInfo }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [description, setDescription] = useState('');
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);

  // Reset image error when imageUrl changes
  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  useEffect(() => {
    const fetchHotelImage = async () => {
      try {
        const response = await fetch(
          `/api/hotel-images?hotelName=${encodeURIComponent(result.name)}&location=${encodeURIComponent(`${result.geoCode.latitude},${result.geoCode.longitude}`)}`
        );
        const data = await response.json();
        setImageUrl(data.thumbnailUrl);
      } catch (error) {
        console.error('Error fetching hotel image:', error);
      }
    };

    fetchHotelImage();
  }, [result.name, result.geoCode.latitude, result.geoCode.longitude]);

  useEffect(() => {
    const generateDescription = async () => {
      if (isDogFriendly && dogFriendlyInfo) {
        setIsLoadingDescription(true);
        try {
          const response = await fetch('/api/generate-description', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ hotelInfo: dogFriendlyInfo }),
          });
          const data = await response.json();
          setDescription(data.description);
        } catch (error) {
          console.error('Error fetching description:', error);
        } finally {
          setIsLoadingDescription(false);
        }
      }
    };

    generateDescription();
  }, [isDogFriendly, dogFriendlyInfo]);

  return (
    <li className="border p-4 rounded shadow hover:shadow-lg flex items-start gap-4 relative">
    <div className="w-32 h-32 flex-shrink-0">
      {imageUrl && !imageError ? (
        <img 
          src={imageUrl} 
          alt={`${formatHotelName(result.name)}`}
          className="w-full h-full object-cover rounded"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
          <FaBuilding className="text-gray-400 text-4xl" />
        </div>
      )}
    </div>
    <div className="flex-grow">
      <div className="flex items-start justify-between">
        <h2 className="font-semibold">{formatHotelName(result.name)}</h2>
        {isDogFriendly && (
          <div className="relative group">
            <div className="relative">
              <FaPaw 
                className="text-2xl text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div className="absolute hidden group-hover:block bg-white p-2 rounded shadow-lg -left-24 top-8 w-48 text-sm text-gray-700 z-10">
              Verified Dog-Friendly Hotel
            </div>
          </div>
        )}
      </div>
      <p>{Math.round((result.distance.value / 1.6) * 10) / 10} miles from {decodeURIComponent(location)}</p>
      {isDogFriendly && (
        <div className="mt-2">
          {isLoadingDescription ? (
            <p className="text-gray-500 italic">Loading dog-friendly details...</p>
          ) : (
            <div className="text-pink-600 font-semibold">
              <div dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br>') }} />
            </div>
          )}
        </div>
      )}
    </div>
  </li>
  );
};