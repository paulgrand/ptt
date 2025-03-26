"use client";

import { useRef, useEffect } from "react";
import { forwardRef } from 'react';

const LocationPicker = forwardRef(({ value, onChange, onPlaceSelected }, forwardedRef) => {
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps JavaScript API not loaded.");
      return;
    }

    // Initialize Autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      forwardedRef.current,
      {
        types: ["landmark", "locality", "point_of_interest", "postal_code", "colloquial_area"],
        componentRestrictions: { country: "uk" },
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        onChange({
          formattedAddress: place.formatted_address,
          lat,
          lng,
        });
        // Call the callback after place is selected
        onPlaceSelected?.();
      }
    });
  }, []);

  return (
    <input
      type="text"
      placeholder="Enter location"
      ref={forwardedRef}
      value={value?.formattedAddress || ""}
      onChange={(e) => onChange({ ...value, formattedAddress: e.target.value })}
      className="w-full p-2 border rounded"
      style={{ minHeight: '40px' }} // Ensure good tap target size
    />
  );
});

LocationPicker.displayName = 'LocationPicker';

export default LocationPicker;
