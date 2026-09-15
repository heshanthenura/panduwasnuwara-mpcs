import { seedUsers } from './users';
import { seedSettings } from './settings';
import { seedGallery } from './gallery';
import { seedBusinesses } from './businesses';
import { seedNews } from './news';

export async function runAllSeeds(): Promise<void> {
  await seedUsers();
  await seedSettings();
  await seedGallery();
  await seedBusinesses();
  await seedNews();
}

export { seedUsers, seedSettings, seedGallery, seedBusinesses, seedNews };
