"use client";
import Image from 'next/image';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LocationPicker from "@/components/LocationPicker";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* COLOURS: */
// #86795A
// #A3A38B
// #EEDAC2
// #E8B59B
// #C77465


// Carousel component
// First, create a new Carousel component
const ImageCarousel = () => {
  const images = [
    {
      src: '/carousel0.jpg',
      position: 'center center' // Default center positioning
    },
    {
      src: '/carousel1.jpg',
      position: 'center center' // Default center positioning
    },
    {
      src: '/carousel2.jpg',
      position: 'center center' // Default center positioning
    },
    {
      src: '/carousel3.jpg',
      position: 'center bottom' // Default center positioning
    },
    {
      src: '/carousel4.jpg',
      position: 'center center' // Default center positioning
    },
    {
      src: '/carousel5.jpg',
      position: 'center right' // Default center positioning
    },
    {
      src: '/carousel6.jpg',
      position: 'center center' // Default center positioning
    },
    {
      src: '/carousel7.jpg',
      position: 'center top' // Keep the top of the image in view
    },
    {
      src: '/carousel8.jpg',
      position: 'center 30%' // Position 30% from the top
    },
    {
      src: '/carousel9.jpg',
      position: 'center center' // Default center positioning
    },
    {
      src: '/carousel10.jpg',
      position: 'center 80%' // Default center positioning
    },
  ];

  const [shuffledImages, setShuffledImages] = useState(images);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Shuffle images only after component mounts on client
  useEffect(() => {
    const shuffleImages = () => {
      const shuffled = [...images];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledImages(shuffled);
    };

    shuffleImages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === shuffledImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(timer);
  }, [shuffledImages.length]);


  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {shuffledImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out
            ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={image.src}
            alt={`Slide ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
            style={{
              objectPosition: image.position
            }}
          />
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
        {/* Logo section outside the carousel */}
        {/* Logo section */}
        <div className="pt-4 pb-4 flex justify-center w-full">
          <div className="bg-white/20 pl-20 backdrop-blur-sm rounded-xl p-2 shadow-xl max-w-4xl w-full mx-auto"> {/* Added max-w-4xl and mx-auto */}
            <div className="flex items-center gap-6">
              <Image
                src="/ptt.png"
                alt="Phoebe's Travel Tails"
                width={180}
                height={180}
                priority
              />
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-medium tracking-tight mb-2">
                  Travel Tails
                </h1>
                <p className="text-gray-20 max-w-2xl text-sm leading-relaxed">
                  Researched and verified dog friendly hotels.
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="relative h-[500px]">
          <ImageCarousel />

          <div className="relative z-10 h-full flex flex-col items-center">
            <div className="flex items-center justify-center p-6">
              <div className="w-full max-w-4xl">
                <div style={{marginTop: "5em"}} className="bg-white/35 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <form onSubmit={handleSearch} className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:gap-4 md:items-end">
                    <div className="flex-1 min-w-[300px]">
                      <label style={{ color: '#222222' }} className="block text-md font-medium mb-2">Location</label>
                      <LocationPicker
                        value={location}
                        onChange={setLocation}
                        ref={locationInputRef}
                        onPlaceSelected={handlePlaceSelected}
                      />
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <label style={{ color: "#222222" }} className="block text-md font-large mb-2">Dates</label>
                      <div className="relative">
                        <DatePicker
                          selectsRange={true}
                          startDate={dateRange.startDate}
                          endDate={dateRange.endDate}
                          onChange={(update) => {
                            const [start, end] = update;

                            // If selecting start date, only allow today or future dates
                            if (start) {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);

                              if (start < today) {
                                return; // Don't allow past dates
                              }
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
                          minDate={new Date()}
                          monthsShown={1} // Show only 1 month on mobile
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Select dates"
                          className="w-full p-2 border rounded"
                          calendarClassName="border rounded shadow-lg"
                          showDisabledMonthNavigation
                          ref={datePickerRef}
                          isClearable={true}
                        />
                        {dateRange.startDate && dateRange.endDate && (
                          <div className="absolute -bottom-6 left-0 text-sm text-gray-600">
                            {calculateNights(dateRange.startDate, dateRange.endDate)} nights
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full md:w-auto bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-800 transition-colors"
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>
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
                    <li><a href="/terms-and-conditions" className="text-gray-600 text-sm hover:text-gray-900">Terms and Conditions</a></li>
                    <li><a href="/privacy-policy" className="text-gray-600 text-sm hover:text-gray-900">Privacy Policy</a></li>
                    <li><a href="/cookie-policy" className="text-gray-600 text-sm hover:text-gray-900">Cookie Policy</a></li>
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




















{/*  */ }