
import { Check, BarChart3, ScanFace, UserRound, SparkleIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: ScanFace,
      title: "AI Skin Analysis",
      description: "Advanced deep learning models analyze your skin type and temporary conditions in seconds."
    },
    {
      icon: BarChart3,
      title: "Skin Score Tracking",
      description: "Monitor your skin health progress with our proprietary scoring system."
    },
    {
      icon: UserRound,
      title: "Personalized Routines",
      description: "Get custom morning and night skincare routines based on your unique needs."
    },
    {
      icon: SparkleIcon,
      title: "Chapter Boxes",
      description: "Receive curated product collections perfectly matched to your skin's journey."
    }
  ];

  return (
    <section className="container py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Complete Skincare Solution</h2>
        <p className="text-muted-foreground text-lg">
          Skin Chapters combines cutting-edge AI technology with dermatologist-approved recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="chapter-card border-none overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-skin-purple/10 flex items-center justify-center mb-2">
                <feature.icon className="h-6 w-6 text-skin-purple" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-skin-purple/5 rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Backed by Science</h3>
            <p className="text-muted-foreground">
              Our AI models are trained on over 5,000 labeled facial images and continuously improved through machine learning.
            </p>
            <ul className="space-y-2">
              {["99.9% accuracy target", "Transfer learning from EfficientNetB0", "Multi-label classification", "Dermatologist verified"].map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-skin-purple shrink-0 mr-2 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt="AI skin analysis visualization" 
              className="w-full h-auto object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
