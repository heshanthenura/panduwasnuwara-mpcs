import HeroSection from '@/app/components/HeroSection';
import BoardSection from '@/app/[locale]/BoardSection';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <HeroSection />
      {/* Spacing between hero section and Director Board section */}
      <div className="my-6 sm:my-10">
        <BoardSection />
      </div>
    </div>
  );
}
