import HeroSection from '@/app/components/HeroSection';
import BoardSection from '@/app/[locale]/BoardSection';
import AboutSection from '@/app/[locale]/AboutSection';
import BusinessesSection from '@/app/[locale]/BusinessesSection';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <HeroSection />
      <BoardSection />
      <AboutSection />
      <BusinessesSection />
    </div>
  );
}
