import HeroSection from '@/components/sections/HeroSection';
import GalleryPreview from '@/components/sections/GalleryPreview';
import AboutSummary from '@/components/sections/AboutSummary';
import BookingCTA from '@/components/sections/BookingCTA';
import RentalsPreview from '@/components/sections/RentalsPreview';
import Testimonials from '@/components/sections/Testimonials';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSummary />
      <GalleryPreview />
      <RentalsPreview />
      <Testimonials />
      <BookingCTA />
    </main>
  );
}
