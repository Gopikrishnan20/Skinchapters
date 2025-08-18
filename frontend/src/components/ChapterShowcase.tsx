
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ChapterShowcase = () => {
  const chapters = [
    {
      number: 1,
      title: "Hydration",
      description: "Begin your journey with deep moisture restoration",
      color: "from-skin-purple-light to-skin-purple/30",
      textColor: "text-skin-purple-dark"
    },
    {
      number: 2,
      title: "Repair",
      description: "Address specific skin concerns and damage",
      color: "from-skin-peach-light to-skin-peach/30",
      textColor: "text-skin-peach-dark"
    },
    {
      number: 3,
      title: "Protection",
      description: "Build a barrier against environmental stressors",
      color: "from-skin-green-light to-skin-green/30",
      textColor: "text-skin-green-dark"
    },
    {
      number: 5,
      title: "Brightening & Glow",
      description: "Enhance your skin's natural luminosity and even tone",
      color: "from-amber-50 to-amber-100/30",
      textColor: "text-amber-700"
    }
  ];

  return (
    <section className="container py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Skin Story Unfolds</h2>
        <p className="text-muted-foreground text-lg">
          Each chapter addresses a specific part of your skincare journey, with products perfectly matched to your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {chapters.map((chapter, index) => (
          <div key={index} className={`rounded-3xl p-6 bg-gradient-to-br ${chapter.color} shadow-md`}>
            <div className="h-full flex flex-col">
              <div className="mb-4">
                <span className={`text-5xl font-bold ${chapter.textColor}`}>
                  {chapter.number}
                </span>
                <h3 className="text-2xl font-semibold mt-2">Chapter {chapter.number}: {chapter.title}</h3>
                <p className="mt-2 text-foreground/80">{chapter.description}</p>
              </div>
              <div className="mt-auto pt-6">
                <Button asChild variant="outline" className="bg-white/50 hover:bg-white/80 border-0">
                  <Link to={`/chapters/${chapter.number}`}>
                    View Chapter
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button asChild variant="outline" size="lg" className="rounded-full">
          <Link to="/chapters">
            View All Chapters
            <ChevronRight className="ml-1 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default ChapterShowcase;
