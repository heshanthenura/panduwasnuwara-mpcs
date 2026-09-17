import { query } from '@/lib/db';
import { initDatabaseSchema } from '@/lib/db/schema';
import { FuelPrice } from '@/lib/types';

export const DEFAULT_FUEL_PRICES: FuelPrice[] = [
  {
    id: 'kerosene',
    name_en: 'Kerosene',
    name_si: 'භූමිතෙල්',
    price_per_liter: 235.00,
    updated_at: new Date().toISOString()
  },
  {
    id: 'petrol-92',
    name_en: 'Petrol 92',
    name_si: 'පෙට්රල් 92',
    price_per_liter: 311.00,
    updated_at: new Date().toISOString()
  },
  {
    id: 'super-diesel',
    name_en: 'Super Diesel',
    name_si: 'සුපර් ඩීසල්',
    price_per_liter: 328.00,
    updated_at: new Date().toISOString()
  }
];

export async function getAllFuelPrices(): Promise<FuelPrice[]> {
  await initDatabaseSchema();
  try {
    const rows = await query(
      `SELECT id, name_en, name_si, CAST(price_per_liter AS FLOAT) as price_per_liter, updated_at 
       FROM fuel_prices 
       ORDER BY CASE 
         WHEN id = 'petrol-92' THEN 1 
         WHEN id = 'super-diesel' THEN 2 
         WHEN id = 'kerosene' THEN 3 
         ELSE 4 
       END ASC`
    );

    if (!rows || rows.length === 0) {
      return DEFAULT_FUEL_PRICES;
    }

    return rows.map((row: any) => ({
      id: row.id,
      name_en: row.name_en,
      name_si: row.name_si,
      price_per_liter: Number(row.price_per_liter) || 0,
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
    }));
  } catch (err) {
    console.error('Error in getAllFuelPrices:', err);
    return DEFAULT_FUEL_PRICES;
  }
}

export async function updateFuelPrice(id: string, price: number): Promise<FuelPrice | null> {
  await initDatabaseSchema();
  try {
    const rows = await query(
      `UPDATE fuel_prices 
       SET price_per_liter = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING id, name_en, name_si, CAST(price_per_liter AS FLOAT) as price_per_liter, updated_at`,
      [price, id]
    );

    if (!rows || rows.length === 0) return null;
    const row = rows[0] as any;
    return {
      id: row.id,
      name_en: row.name_en,
      name_si: row.name_si,
      price_per_liter: Number(row.price_per_liter) || 0,
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
    };
  } catch (err) {
    console.error(`Error updating fuel price for ${id}:`, err);
    return null;
  }
}

export async function updateAllFuelPrices(prices: Record<string, number>): Promise<FuelPrice[]> {
  await initDatabaseSchema();
  for (const [id, price] of Object.entries(prices)) {
    if (typeof price === 'number' && !isNaN(price)) {
      await updateFuelPrice(id, price);
    }
  }
  return getAllFuelPrices();
}
