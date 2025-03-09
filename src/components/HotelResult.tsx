"use client";
import { useState, useEffect } from 'react';
import { FaPaw, FaBuilding, FaChevronDown, FaChevronUp, FaCreditCard, FaDog, FaCheck, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import MapModal from './MapModal';


const getLowestPrice = (offers: any[]): number | null => {
  if (!offers || !offers.length) return null;
  
  return Math.min(...offers.map(offer => parseFloat(offer.price.total)));
};

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

type HotelResultProps = {
  result: any; // Replace with proper type
  location: string;
  isDogFriendly: boolean;
  dogFriendlyInfo?: {
    weightSizeLimit: string;
    dogFee: string;
    areasPermitted: string;
    areasNotPermitted: string;
    allowedInRoomWithoutOwners: boolean;
    dogAmenetiesProvided: string;
    walkTypesNearHotel: string;
    grassAreaNearHotel: string;
    enclosedGarden: boolean;
    dogsAllowedAtBreakfast: boolean;
  };
};

export default function HotelResult({ result, location, isDogFriendly, dogFriendlyInfo }: HotelResultProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getLowestPrice = (offers) => {
    if (!offers || !offers.length) return null;
    return Math.min(...offers.map(offer => parseFloat(offer.price.total)));
  };

  const lowestPrice = getLowestPrice(result.offers);
  const imageUrl = result.image; // Adjust based on your data structure

  const formatHotelName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  };

  const DogFriendlyDetails = ({ info }) => (
    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-4">
      <h4 className="font-medium text-lg flex items-center gap-2 mb-4">
        <FaDog className="text-orange" />
        Dog-Friendly Information
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <p className="font-medium">Size/Weight Limit</p>
            <p className="text-gray-600">{info.weightSizeLimit || 'Not specified'}</p>
          </div>
          
          <div>
            <p className="font-medium">Fee</p>
            <p className="text-gray-600">{info.dogFee || 'Not specified'}</p>
          </div>

          <div>
            <p className="font-medium">Allowed in Room Without Owners?</p>
            <p className="flex items-center gap-1">
              {info.allowedInRoomWithoutOwners ? (
                <FaCheck className="text-green-500" />
              ) : (
                <FaTimes className="text-red-500" />
              )}
            </p>
          </div>

          <div>
            <p className="font-medium">Dogs at Breakfast?</p>
            <p className="flex items-center gap-1">
              {info.dogsAllowedAtBreakfast ? (
                <FaCheck className="text-green-500" />
              ) : (
                <FaTimes className="text-red-500" />
              )}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="font-medium">Permitted Areas</p>
            <p className="text-gray-600">{info.areasPermitted || 'Not specified'}</p>
          </div>

          <div>
            <p className="font-medium">Restricted Areas</p>
            <p className="text-gray-600">{info.areasNotPermitted || 'Not specified'}</p>
          </div>

          <div>
            <p className="font-medium">Dog Amenities</p>
            <p className="text-gray-600">{info.dogAmenetiesProvided || 'Not specified'}</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-lg p-4 mt-2">
          <h5 className="font-medium mb-3">Outdoor Facilities</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium text-sm">Walk Types Nearby</p>
              <p className="text-gray-600">{info.walkTypesNearHotel || 'Not specified'}</p>
            </div>
            <div>
              <p className="font-medium text-sm">Grass Area</p>
              <p className="text-gray-600">{info.grassAreaNearHotel || 'Not specified'}</p>
            </div>
            <div>
              <p className="font-medium text-sm">Enclosed Garden</p>
              <p className="flex items-center gap-1">
                {info.enclosedGarden ? (
                  <FaCheck className="text-green-500" />
                ) : (
                  <FaTimes className="text-red-500" />
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      <li 
        className="border p-4 rounded-t shadow hover:shadow-lg flex items-start gap-4 relative cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
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
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">{formatHotelName(result.name)}</h2>
              {isExpanded ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
            </div>
            <div className="flex items-center gap-2">
              {lowestPrice ? (
                <span className="text-lg font-semibold text-green-600">
                  £{lowestPrice.toFixed(2)}
                </span>
              ) : (
                <span className="text-xs text-gray-500 italic w-24 text-right">
                  Not available
                </span>
              )}
              {isDogFriendly && (
                <div className="relative group">
                  <FaPaw 
                    className="text-orange text-xl"
                    aria-label="Dog Friendly Hotel"
                  />
                  <div className="absolute hidden group-hover:block bg-white p-2 rounded shadow-lg -left-24 top-8 w-48 text-sm text-gray-700 z-10">
                    Verified Dog-Friendly Hotel
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-gray-600 mt-2">
                {Math.round((result.distance.value / 1.6) * 10) / 10} miles from {decodeURIComponent(location)}
              </p>
            </div>
            
            <div className="mt-auto pt-4 flex justify-end border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMapOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm transition-colors duration-150 ease-in-out mt-4"
              >
                <FaMapMarkerAlt />
                View on Map
              </button>
            </div>
          </div>
        </div>
      </li>

      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        hotelName={result.name}
        latitude={result.geoCode.latitude}
        longitude={result.geoCode.longitude}
      />

      {isExpanded && (
        <div className="border-x border-b rounded-b p-4 shadow-lg -mt-px bg-gray-50">
          {isDogFriendly && dogFriendlyInfo && (
            <DogFriendlyDetails info={dogFriendlyInfo} />
          )}

          <h3 className="font-semibold mb-4 text-lg">Available Offers</h3>
          <div className="space-y-4">
            {result.offers?.map((offer, index) => (
              <div 
                key={index}
                className="bg-white p-4 rounded-lg border hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Room Type: {offer.room?.type || 'Standard Room'}</p>
                    <p className="text-sm text-gray-600">
                      {offer.room?.description?.text || 'Room description not available'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      £{parseFloat(offer.price.total).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">per night</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add your booking logic here
                      console.log('Booking offer:', offer);
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}