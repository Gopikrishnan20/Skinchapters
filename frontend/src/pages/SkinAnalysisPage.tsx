import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, CameraIcon, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface SkinAnalysisResult {
  skin_type: string;
  conditions: string[];
  skin_score: number;
  recommended_chapter: number;
}

// Mapping from backend string to chapter number
const chapterMapping: Record<string, number> = {
  "hydration-basics": 1,
  "repair": 2,
  "protection": 3,
  "maintenance": 4,
  "brightening-glow": 5,
  "repair-recovery": 6,
  "maintenance-prevention": 7
};

const SkinAnalysisPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
        setStep(2);
        analyzeImage(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();

      const mappedResult: SkinAnalysisResult = {
        skin_type: data.predicted_skin_type,
        conditions: Object.keys(data.skin_conditions),
        skin_score: Math.round(data.overall_skin_condition_score),
        recommended_chapter: chapterMapping[data.recommended_chapter] || 1
      };

      setAnalysisResult(mappedResult);
      setAnalysisProgress(100);

      setTimeout(() => {
        setStep(3);
        setIsAnalyzing(false);
      }, 500);
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your image. Please try again.",
        variant: "destructive"
      });
      setIsAnalyzing(false);
      clearInterval(interval);
    }
  };

  const handleProceedToChapter = () => {
    if (analysisResult) {
      setStep(4);
      setTimeout(() => {
        navigate(`/chapters/${analysisResult.recommended_chapter}`);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Steps UI */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center max-w-2xl w-full">
              {["Upload", "Analysis", "Results", "Complete"].map((label, index) => {
                const stepNumber = (index + 1) as 1 | 2 | 3 | 4;
                return (
                  <div key={label} className="flex items-center flex-1">
                    <div className={`flex flex-col items-center ${step >= stepNumber ? "text-skin-purple" : "text-muted-foreground"}`}>
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${step >= stepNumber ? "bg-skin-purple text-white" : "bg-muted"}`}>
                        {stepNumber}
                      </div>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    {stepNumber < 4 && (
                      <div className={`h-1 flex-1 mx-2 ${step > stepNumber ? "bg-skin-purple" : "bg-muted"}`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 1 — Upload */}
          {step === 1 && (
            <Card className="bg-white shadow-md border-0">
              <CardHeader>
                <CardTitle className="text-center">Upload Your Selfie</CardTitle>
                <CardDescription className="text-center">
                  For best results, use a well-lit photo with your face clearly visible and no makeup.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-full max-w-md p-8 border-2 border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop your image here or</p>
                  <Input type="file" accept="image/*" className="hidden" id="image-upload" onChange={handleImageUpload} />
                  <label htmlFor="image-upload">
                    <Button variant="outline" className="cursor-pointer">
                      <CameraIcon className="mr-2 h-4 w-4" />
                      Choose Image
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2 — Analyzing */}
          {step === 2 && (
            <Card className="bg-white shadow-md border-0">
              <CardHeader>
                <CardTitle className="text-center">Analyzing Your Skin</CardTitle>
                <CardDescription className="text-center">
                  Our AI is examining your skin type, conditions, and determining your personalized routine.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center p-8">
                {image && (
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-skin-purple-light mb-6">
                    <img src={image} alt="Uploaded face" className="w-full h-full object-cover" />
                  </div>
                )}
                <Progress value={analysisProgress} className="h-2 w-full max-w-md" />
                <p className="mt-2 text-sm">{analysisProgress}%</p>
              </CardContent>
            </Card>
          )}

          {/* Step 3 — Results */}
          {step === 3 && analysisResult && (
            <Card className="bg-white shadow-md border-0">
              <CardHeader>
                <CardTitle className="text-center">Your Skin Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Skin Type:</strong> {analysisResult.skin_type}</p>
                <p><strong>Skin Score:</strong> {analysisResult.skin_score}</p>
                <p><strong>Conditions:</strong> {analysisResult.conditions.join(", ")}</p>
                <p><strong>Recommended Chapter:</strong> {analysisResult.recommended_chapter}</p>
                <Button onClick={handleProceedToChapter} className="mt-4">
                  Get Your Recommended Chapter
                  <ChevronRight className="ml-1 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 4 — Complete */}
          {step === 4 && (
            <Card className="bg-white shadow-md border-0">
              <CardHeader>
                <CardTitle className="text-center">Perfect Match Found!</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                Redirecting you to your personalized chapter...
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SkinAnalysisPage;
