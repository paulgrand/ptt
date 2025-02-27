"use client";
import Image from 'next/image';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LocationPicker from "@/components/LocationPicker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Dog Friendly Hotels - Phoebe's Travel Tails",
//   description: "Researched dog friendly hotels, we call each hotel periodically to determine just how dog-friendly each property is.",
// };

/* COLOURS: */
// #86795A
// #A3A38B
// #EEDAC2
// #E8B59B
// #C77465

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter(); // Add this hook

  const [location, setLocation] = useState({
    formattedAddress: "",
    lat: null,
    lng: null,
  });
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const locationInputRef = useRef(null);
  const datePickerRef = useRef(null);  // Add this ref

  useEffect(() => {
    if (locationInputRef.current) {
      locationInputRef.current.focus();
    }
  }, []);

  const handlePlaceSelected = () => {
    // Set only the startDate to today, leaving endDate as null
    setDateRange({
      startDate: new Date(),
      endDate: null
    });

    // Open the date picker
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!location.lat || !location.lng || !dateRange.startDate || !dateRange.endDate) {
      alert("Please fill in all fields");
      return;
    }

    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    router.push(
      `/results/${encodeURIComponent(location.formattedAddress)}/${formatDate(dateRange.startDate)}/${formatDate(dateRange.endDate)}/${location.lat}/${location.lng}`
    );
  };

  // Add function to calculate days between dates
  const calculateNights = (start, end) => {
    if (!start || !end) return null;
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">  {/* reduced mb-12 to mb-8 */}
            <Image
              src="/ptt.jpg"
              alt="Phoebe's Travel Tails"
              width={120}
              height={120}
              priority
            />
            <h1 className="text-2xl font-medium tracking-tight mt-4 mb-2">  {/* changed from text-3xl to text-2xl and adjusted font-weight */}
              Phoebe&apos;s Travel Tails
            </h1>
            <p className="text-gray-600 max-w-2xl text-sm leading-relaxed">  {/* added text-sm and leading-relaxed */}
              Researched dog friendly hotels, we call each hotel periodically to determine just how dog-friendly each property is.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
            <div className="w-96">
              <label className="block text-sm font-medium mb-1">Location</label>
              <LocationPicker
                value={location}
                onChange={setLocation}
                ref={locationInputRef}
                onPlaceSelected={handlePlaceSelected}
              />
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Dates</label>
                <div className="relative">
                <DatePicker
    selectsRange={true}
    startDate={dateRange.startDate}
    endDate={dateRange.endDate}
    onChange={(update) => {
      const [start, end] = update;
      // If selecting start date, allow any valid date
      if (!start) {
        setDateRange({ startDate: null, endDate: null });
        return;
      }
      // If selecting end date, enforce minimum stay
      if (start && !end) {
        const minEndDate = new Date(start);
        minEndDate.setDate(minEndDate.getDate() + 1); // Minimum 1 night stay
        if (update[1] && update[1] < minEndDate) {
          return; // Don't allow selection of end date less than minimum
        }
      }
      setDateRange({
        startDate: start,
        endDate: end
      });
    }}
    minDate={dateRange.startDate ? new Date(dateRange.startDate) : new Date()}
    monthsShown={2}
    dateFormat="dd/MM/yyyy"
    placeholderText="Select dates"
    className="w-full p-2 border rounded"
    calendarClassName="border rounded shadow-lg"
    showDisabledMonthNavigation
    ref={(el) => {
      if (el) {
        datePickerRef.current = el;
      }
    }}
    selectsStart
  />
                  {dateRange.startDate && dateRange.endDate && (
                    <div className="absolute -bottom-6 left-0 text-sm text-gray-600">
                      {calculateNights(dateRange.startDate, dateRange.endDate)} nights
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded whitespace-nowrap"
            >
              Search
            </button>
          </form>

        </div>
        {children}
      </body>
    </html>
  );
}