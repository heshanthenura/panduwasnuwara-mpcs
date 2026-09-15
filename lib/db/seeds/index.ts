import { seedUsers } from './users';
import { seedSettings } from './settings';
import { seedGallery } from './gallery';

export async function runAllSeeds(): Promise<void> {
  await seedUsers();
  await seedSettings();
  await seedGallery();
}

export { seedUsers, seedSettings, seedGallery };
