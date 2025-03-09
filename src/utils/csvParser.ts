import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// utils/csvParser.ts
interface DogFriendlyRecord {
  hotelId: string;
  hotelName: string;
  city: string;
  phone: string;
  agent: string;
  dogFriendly: string;
  weightSizeLimit: string;
  maxDogs: string;
  dogFee: string;
  areasPermitted: string;
  areasNotPermitted: string;
  allowedInRoomWithoutOwners: string;
  dogAmenetiesProvided: string;
  walkTypesNearHotel: string;
  grassAreaNearHotel: string;
  enclosedGarden: string;
  dogsAllowedAtBreakfast: string;
}

export function getDogFriendlyHotels(): Map<string, DogFriendlyRecord> {
  const csvPath = path.join(process.cwd(), 'dogfriendliness.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });
  
  // Create a Map of hotelId to full record
  return new Map(
    records.map(record => [record.hotelId, record as DogFriendlyRecord])
  );
}
