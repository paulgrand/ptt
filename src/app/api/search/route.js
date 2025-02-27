import { NextResponse } from "next/server";

// Function to fetch OAuth2 token
async function getAccessToken() {
  const response = await fetch(process.env.OAUTH2_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.OAUTH2_CLIENT_ID,
      client_secret: process.env.OAUTH2_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to obtain access token");
  }

  const data = await response.json();
  return data.access_token; // Extract the token
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  console.log(req.url)
  const location = searchParams.get("location");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  console.log(`Lat: ${lat}`)
  console.log(`Lon: ${lng}`)

  if (!location || !startDate || !endDate || !lat || !lng) {
    console.log(`missing params!`)
    return NextResponse.json(
      { error: "Missing required parameters: location, startDate, endDate, lat, lng" },
      { status: 400 }
    );
  }

  try {
    // Get OAuth2 access token
    const accessToken = await getAccessToken();

    const hotelSearchUrl = `${process.env.HOTELS_API_URL}?
      &latitude=${lat}
      &longitude=${lng}
      &radius=20
      &amenities=PETS_ALLOWED`
    console.log(`API URL: ${hotelSearchUrl}`);
    const apiResponse = await fetch(
      hotelSearchUrl,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Attach OAuth2 token
          "Content-Type": "application/json",
        },
      }
    );

    // if (!apiResponse.ok) {
    //   const errorData = await apiResponse.json();
    //   return NextResponse.json(
    //     { error: "Failed to fetch results from API", details: errorData },
    //     { status: apiResponse.status }
    //   );
    // }

    const { data, meta } = await apiResponse.json();
    console.log(meta);

    

    // Construct an array of HotelIDs to send to 

    // console.dir(data);
    // console.log(data[1].address);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred", details: error.message },
      { status: 500 }
    );
  }
}
