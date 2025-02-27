// app/api/generate-description/route.ts
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  const { hotelInfo } = await request.json();

  try {
    const prompt = `
      Create a friendly, informal description of this hotel's dog-friendly features.
      Make it conversational, and highlight the most important aspects.
      
      Hotel details:
      - Dog friendly?: ${hotelInfo.dogFriendly ? 'Yes' : 'No'}
      - Dog Size/weight Allowed: ${hotelInfo.weightSizeLimit}
      - Dog Fee: ${hotelInfo.dogFee}
      - Areas of the hotel where a dog is allowed: ${hotelInfo.areasPermitted}
      - Areas a dog isn't allowed: ${hotelInfo.areasNotPermitted}
      - Allowed in room without owners: ${hotelInfo.allowedInRoomWithoutOwners}
      - Dog Ameneties Provided: ${hotelInfo.dogAmenetiesProvided}
      - Walk types near hotel: ${hotelInfo.walkTypesNearHotel}
      - Grass area near hotel: ${hotelInfo.grassAreaNearHotel}
      - Enclosed garden: ${hotelInfo.enclosedGarden}
      - Dogs allowed to join their owners at breakfast: ${hotelInfo.dogsAllowedAtBreakfast}
    `;

    // hotelId,hotelName,city,phone,agent,
    // dogFriendly,weightSizeLimit,maxDogs,dogFee,areasPermitted,areasNotPermitted,allowedInRoomWithoutOwners,dogAmenetiesProvided,walkTypesNearHotel,grassAreaNearHotel,enclosedGarden,dogsAllowedAtBreakfast

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    // console.log('OpenAI API Response:', completion.choices[0].messages);

    return NextResponse.json({ 
      description: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
}
