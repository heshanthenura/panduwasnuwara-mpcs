import HeroSection from '@/app/components/HeroSection';
import BoardSection from '@/app/[locale]/BoardSection';
import AboutSection from '@/app/[locale]/AboutSection';
import BusinessesSection from '@/app/[locale]/BusinessesSection';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <HeroSection />
      {/* Spacing between hero section and Director Board section */}
      <div className="my-6 sm:my-10">
        <BoardSection />
      </div>
      {/* About Us section below Board section */}
      <div className="mb-6 sm:mb-10">
        <AboutSection />
      </div>
    </div>
  );
}
