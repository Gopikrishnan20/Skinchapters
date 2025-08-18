
import { Camera, Stars, ScrollText, PackageCheck } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Camera,
      title: "Scan Your Face",
      description: "Take a selfie with our guided camera interface for AI analysis."
    },
    {
      icon: Stars,
      title: "Get Your Analysis",
      description: "Our AI identifies your skin type and current conditions."
    },
    {
      icon: ScrollText,
      title: "Receive Recommendations",
      description: "Get a personalized skincare routine for morning and night."
    },
    {
      icon: PackageCheck,
      title: "Start Your Chapter",
      description: "Receive your first Chapter Box with perfect-match products."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-skin-purple/5 to-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            Four simple steps to transform your skincare routine with AI-powered precision
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="skin-glass p-6 h-full">
                <div className="w-12 h-12 rounded-full bg-skin-purple/10 flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-skin-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-skin-purple/30"></div>
                </div>
              )}
              
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-background flex items-center justify-center border border-skin-purple/20 text-skin-purple font-bold">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
