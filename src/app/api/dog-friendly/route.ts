// app/api/dog-friendly/route.ts
import { getDogFriendlyHotels } from '@/utils/csvParser';
import { NextResponse } from 'next/server';

export async function GET() {
  const dogFriendlyHotels = getDogFriendlyHotels();
  // Convert Map to a plain object for serialization
  const dogFriendlyData = Object.fromEntries(dogFriendlyHotels);
  return NextResponse.json(dogFriendlyData);
}