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


// Carousel component
// First, create a new Carousel component
const ImageCarousel = () => {
  const images = [
    '/carousel1.jpg',
    '/image2.jpg',
    '/image3.jpg',
    // Add your image paths here
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // 10 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out
            ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={image}
            alt={`Slide ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover"
          />
          {/* Add a dark overlay to make form content more visible */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}
    </div>
  );
};


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
    // setDateRange({
    //   startDate: new Date(),
    //   endDate: null
    // });

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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <div className="relative min-h-[600px] bg-gray-100">
          <ImageCarousel />
          
          {/* Content overlay */}
          <div className="relative z-10 p-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center mb-8">
              <Image
                src="/ptt.png"
                alt="Phoebe's Travel Tails"
                width={320}
                height={320}
                priority
              />
              <h1 className="text-2xl font-medium tracking-tight mt-4 mb-2 text-white">
                Travel Tails
              </h1>
              <p className="text-gray-200 max-w-2xl text-sm leading-relaxed">
                Researched dog friendly hotels, we call each hotel periodically to determine just how dog-friendly each property is.
              </p>
            </div>

            {/* Search form with white background */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
                {/* ... your existing form content ... */}
              </form>
            </div>
          </div>
        </div>
        {children}


        <div className="mt-auto">
          <footer className="bg-gray-50 border-t mt-20">
            <div className="max-w-4xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">About Us</h3>
                  <p className="text-gray-600 text-sm">
                    Helping pet owners find the perfect dog-friendly accommodations through 
                    thoroughly researched and verified hotel listings.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li><a href="/" className="text-gray-600 text-sm hover:text-gray-900">Home</a></li>
                    <li><a href="/about" className="text-gray-600 text-sm hover:text-gray-900">About</a></li>
                    <li><a href="/contact" className="text-gray-600 text-sm hover:text-gray-900">Contact</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Contact</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>Email: info@TOBECONFIRMED.TBC</li>
                    <li>Follow us on social media</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
                <p>© {new Date().getFullYear()} Travel Tails. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>


      </body>
    </html>
  );
}