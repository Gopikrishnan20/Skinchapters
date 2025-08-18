
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ChaptersPage = () => {
  const chapters = [
    {
      number: 1,
      title: "Hydration",
      description: "Begin your journey with deep moisture restoration",
      products: ["Hydra-Boost Cleanser", "Moisture Lock Serum", "24-Hour Hydration Cream"],
      color: "from-skin-purple-light to-skin-purple/30",
      textColor: "text-skin-purple-dark",
      status: "current"
    },
    {
      number: 2,
      title: "Repair",
      description: "Address specific skin concerns and damage",
      products: ["Gentle Repair Cleanser", "Barrier Restore Ampoule", "Recovery Cream"],
      color: "from-skin-peach-light to-skin-peach/30",
      textColor: "text-skin-peach-dark",
      status: "upcoming"
    },
    {
      number: 3,
      title: "Protection",
      description: "Build a barrier against environmental stressors",
      products: ["Antioxidant Cleanser", "Defense Serum", "SPF 50 Day Shield"],
      color: "from-skin-green-light to-skin-green/30",
      textColor: "text-skin-green-dark",
      status: "upcoming"
    },
    {
      number: 4,
      title: "Maintenance",
      description: "Sustain your skin's health and radiance",
      products: ["Balancing Cleanser", "Radiance Booster", "Overnight Repair Mask"],
      color: "from-blue-50 to-blue-100/30",
      textColor: "text-blue-700",
      status: "upcoming"
    },
    {
      number: 5,
      title: "Brightening & Glow",
      description: "Enhance your skin's natural luminosity and even tone",
      products: ["Enzyme Exfoliating Cleanser", "Vitamin C Brightening Serum", "Glow Restore Night Cream"],
      color: "from-amber-50 to-amber-100/30",
      textColor: "text-amber-700",
      status: "upcoming"
    },
    {
      number: 6,
      title: "Repair & Recovery",
      description: "Intensive treatment for damaged or compromised skin",
      products: ["Ceramide Repair Cleanser", "Peptide Recovery Complex", "Healing Barrier Cream"],
      color: "from-rose-50 to-rose-100/30",
      textColor: "text-rose-700",
      status: "upcoming"
    },
    {
      number: 7,
      title: "Maintenance & Prevention",
      description: "Long-term care to maintain results and prevent future concerns",
      products: ["Gentle Maintenance Cleanser", "Antioxidant Defense Serum", "Age-Prevent Moisturizer"],
      color: "from-emerald-50 to-emerald-100/30",
      textColor: "text-emerald-700",
      status: "upcoming"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Skin Chapters</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Each chapter in your skincare journey addresses specific needs, helping you progress to healthier, more radiant skin.
            </p>
          </div>

          <div className="space-y-10">
            {chapters.map((chapter) => (
              <div key={chapter.number} className={`rounded-3xl bg-gradient-to-br ${chapter.color} overflow-hidden shadow-md`}>
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <div className="flex flex-col h-full">
                        <div>
                          <div className={`text-5xl font-bold ${chapter.textColor} mb-2`}>
                            {chapter.number}
                          </div>
                          <h2 className="text-2xl font-semibold">Chapter {chapter.number}: {chapter.title}</h2>
                          <p className="mt-2 text-foreground/80">{chapter.description}</p>
                        </div>
                        
                        <div className="mt-auto pt-6">
                          {chapter.status === "current" ? (
                            <div className="flex items-center">
                              <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                              <span className="font-medium">Current Chapter</span>
                            </div>
                          ) : (
                            <div className="text-muted-foreground">Coming next</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Card className="bg-white/70 backdrop-blur-sm border-0 h-full">
                        <CardHeader>
                          <CardTitle className="text-xl">Featured Products</CardTitle>
                          <CardDescription>Scientifically formulated for this stage of your journey</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {chapter.products.map((product, idx) => (
                              <li key={idx} className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                                  {idx + 1}
                                </div>
                                <span className="font-medium">{product}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="mt-6">
                            <Button asChild>
                              <Link to={`/chapters/${chapter.number}`}>
                                View Chapter Details
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChaptersPage;
