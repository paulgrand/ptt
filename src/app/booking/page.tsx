// app/booking/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BookingProgress from '@/components/BookingProgress';
import BookingDetailsForm from '@/components/BookingDetailsForm';
import PaymentPlaceholder from '@/components/PaymentPlaceholder';
import BookingComplete from '@/components/BookingComplete';

type BookingStep = 'search' | 'details' | 'payment' | 'complete';

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('details');
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);
  const [resultsUrl, setResultsUrl] = useState<string>('');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Reconstruct the results URL from the search parameters
    const location = searchParams.get('location');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (location && startDate && endDate && lat && lng) {
      const reconstructedUrl = `/results/${location}/${startDate}/${endDate}/${lat}/${lng}`;
      setResultsUrl(reconstructedUrl);
    }
  }, [searchParams]);

  const handleStepClick = (step: BookingStep) => {
    if (step === 'search' && resultsUrl) {
      router.push(resultsUrl);
      return;
    }

    const stepOrder = ['search', 'details', 'payment', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const clickedIndex = stepOrder.indexOf(step);
    
    if (clickedIndex <= currentIndex) {
      setCurrentStep(step);
    }
  };

  const handleBookingDetailsSubmit = (formData: BookingFormData) => {
    setBookingData(formData);
    setCurrentStep('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentStep('complete');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <BookingProgress 
        currentStep={currentStep} 
        onStepClick={handleStepClick}
        resultsUrl={resultsUrl} // Add this prop
      />
      
      {currentStep === 'details' && (
        <BookingDetailsForm onSubmit={handleBookingDetailsSubmit} />
      )}
      
      {currentStep === 'payment' && (
        <PaymentPlaceholder onPaymentComplete={handlePaymentComplete} />
      )}
      
      {currentStep === 'complete' && (
        <BookingComplete 
          bookingDetails={{
            firstName: bookingData?.firstName,
            lastName: bookingData?.lastName,
            email: bookingData?.email,
            bookingReference: undefined
          }}
          resultsUrl={resultsUrl}
        />
      )}
    </div>
  );
}
