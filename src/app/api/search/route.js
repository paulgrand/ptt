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

    // console.log(data)
    // console.log(meta);

    // Take all IDs in the data.hotels array, combine them into a string e.g. hotelId1, hotelId2, hotelId3
    // and use that for a subsequent API request.
    const hotelIds = data.map((hotel) => hotel.hotelId).join(",");
    // console.log(hotelIds);

    // Make a subsequent API request to get the details of the hotels
    const hotelOffersUrl = `${process.env.HOTEL_OFFERS_API_URL}?hotelIds=${hotelIds}&adults=1&checkInDate=${startDate}&checkOutDate=${endDate}&roomQuantity=1`;

      // console.log(`URL: ${hotelOffersUrl}`);

    
      const offersApiResponse = await fetch(
        hotelOffersUrl,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Attach OAuth2 token
            "Content-Type": "application/json",
          },
        }
      );

      // // set data and meta properties of response to offersData and offersMeta.
      const offersApiResponseJson = await offersApiResponse.json();

    // Update data to add a new "offers" property, made up of offersApiResponse.json.data[].offers.
    // console.log('0-------0-----------------');
    console.log(offersApiResponseJson.data[0])

      // For every item in data, check whether hotelId is present in offersApiResponseJson.data, where offersApiResponseJson.data has the format: [ hotel: { hotelId: "something" }, offers: [] }.
      // If it is, add the offers property to the data item.
      data.forEach((item) => {
        console.log(item.hotelId)
        const offer = offersApiResponseJson.data.find(
          (offer) => offer.hotel.hotelId === item.hotelId
        );
        if (offer) {
          item.offers = offer.offers;
        }
      });

    // console.log(data);

    // console.log(data[1].address);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred", details: error.message },
      { status: 500 }
    );
  }
}
