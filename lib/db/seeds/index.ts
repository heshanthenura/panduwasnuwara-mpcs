import { seedUsers } from './users';
import { seedSettings } from './settings';
import { seedGallery } from './gallery';
import { seedBusinesses } from './businesses';

export async function runAllSeeds(): Promise<void> {
  await seedUsers();
  await seedSettings();
  await seedGallery();
  await seedBusinesses();
}

export { seedUsers, seedSettings, seedGallery, seedBusinesses };
