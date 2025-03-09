import { use } from 'react';
import ResultsClient from './ResultsClient';

type PageProps = {
  params: Promise<{
    location: string;
    startDate: string;
    endDate: string;
    lat: string;
    lng: string;
  }>;
};

export default function ResultsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  
  return (
    <ResultsClient
      location={resolvedParams.location}
      startDate={resolvedParams.startDate}
      endDate={resolvedParams.endDate}
      lat={resolvedParams.lat}
      lng={resolvedParams.lng}
    />
  );
}