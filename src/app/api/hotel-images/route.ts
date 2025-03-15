import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const hotelName = searchParams.get("hotelName");
  const location = searchParams.get("location"); // Expecting lat,lng format
  
  if (!hotelName || !location) {
    return NextResponse.json(
      { error: "Missing required parameters: hotelName and location" },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    console.log(`Searching images for ${hotelName} in ${location}`)
    
    // Step 1: Text Search to get Place ID
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${location}&query=${encodeURIComponent(`${hotelName} building`)}&radius=10&key=${apiKey}`;
    const searchResponse = await fetch(textSearchUrl);

    
    if (!searchResponse.ok) {
      throw new Error('Failed to fetch place ID');
    }

    const searchData = await searchResponse.json();
    if (!searchData.results?.[0]?.place_id) {
      return NextResponse.json({
        imageUrl: null,
        thumbnailUrl: null
      });
    }

    const placeId = searchData.results[0].place_id;

    // Step 2: Place Details to get Photo References
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
    const detailsResponse = await fetch(detailsUrl);

    if (!detailsResponse.ok) {
      throw new Error('Failed to fetch place details');
    }

    const detailsData = await detailsResponse.json();
    const photos = detailsData.result?.photos;

    if (!photos || photos.length === 0) {
      return NextResponse.json({
        imageUrl: null,
        thumbnailUrl: null
      });
    }

    // Step 3: Get Photo URLs
    // For thumbnail, we'll use maxwidth=150, for full image maxwidth=800
    const photoReference = photos[0].photo_reference;
    const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${apiKey}`;
    const thumbnailUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&photo_reference=${photoReference}&key=${apiKey}`;
console.log(`Image URL: ${imageUrl}`)
    return NextResponse.json({
      imageUrl,
      thumbnailUrl
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch hotel image", details: error.message },
      { status: 500 }
    );
  }
}