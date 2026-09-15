import HeroSection from '@/app/components/HeroSection';
import BoardSection from '@/app/components/BoardSection';
import AboutSection from '@/app/components/AboutSection';
import BusinessesSection from '@/app/components/BusinessesSection';
import GallerySection from '@/app/components/GallerySection';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <HeroSection />
      <BoardSection />
      <AboutSection />
      <BusinessesSection />
      <GallerySection />
    </div>
  );
}
