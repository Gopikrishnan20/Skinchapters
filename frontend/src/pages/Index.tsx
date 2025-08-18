
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ChapterShowcase from "@/components/ChapterShowcase";
import HowItWorks from "@/components/HowItWorks";
import CallToAction from "@/components/CallToAction";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <ChapterShowcase />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
