
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="container py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-skin-purple to-skin-purple-dark p-8 md:p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white,transparent)]" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Begin Your Skin Journey Today
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Get your personalized skin analysis and start your path to healthier, 
            more radiant skin with our scientifically backed approach.
          </p>
          <Button asChild size="lg" className="bg-white text-skin-purple hover:bg-white/90 rounded-full font-semibold">
            <Link to="/scan">
              Start Your Skin Analysis
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
