import Header from "@/components/ui/header";
import Hero from "@/components/ui/hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      <Hero />
      {/* <Features />
      <Testimonials />
      <CTA />
      <Footer /> */}
    </div>
  );
}
