
import { ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 container">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,hsl(260,67%,75%,0.15),rgba(255,255,255,0))]" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Your Skin Journey, <br />
            <span className="text-skin-purple">Chapter by Chapter</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg">
            AI-powered skin analysis to reveal your unique skin type and conditions,
            with personalized routines for your perfect skin journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="rounded-full font-semibold text-base">
              <Link to="/scan">
                <ScanFace className="mr-2 h-5 w-5" />
                Start Your Scan
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full font-semibold text-base">
              <Link to="/chapters">
                Explore Chapters
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative z-10 aspect-square max-w-md mx-auto">
            <img 
              src="/placeholder.svg" 
              alt="Skin analysis visualization" 
              className="object-cover rounded-3xl shadow-xl"
            />
            <div className="absolute -right-6 -bottom-6 bg-skin-purple/90 text-white p-4 rounded-2xl shadow-lg">
              <p className="font-semibold">Skin Score</p>
              <p className="text-3xl font-bold">87/100</p>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[120%] aspect-square rounded-full bg-skin-purple/5 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
