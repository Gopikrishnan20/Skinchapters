// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Camera, Upload, RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import type { SkinAnalysisResult } from "@/services/skinAnalysisService";

// type ScanState = "initial" | "capturing" | "countdown" | "processing" | "complete";

// const ScanPage = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [scanState, setScanState] = useState<ScanState>("initial");
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [analysisResult, setAnalysisResult] =
//     useState<SkinAnalysisResult | null>(null);

//   const [countdown, setCountdown] = useState<number | null>(null);

//   // Refs
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const handleCapture = async () => {
//     setScanState("capturing");

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//       // Start countdown after camera ready
//       setTimeout(() => {
//         setCountdown(3);
//         setScanState("countdown");
//       }, 500);
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//       toast({
//         title: "Camera access denied",
//         description: "Please allow camera access to capture your photo.",
//         variant: "destructive",
//       });
//       setScanState("initial");
//     }
//   };

//   // Countdown effect
//   useEffect(() => {
//     if (countdown === null) return;
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown((c) => (c ? c - 1 : null)), 1000);
//       return () => clearTimeout(timer);
//     }
//     if (countdown === 0) {
//       takePhoto();
//       setCountdown(null);
//     }
//   }, [countdown]);

//   const takePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       const context = canvas.getContext("2d");
//       if (!context) return;

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);

//       const imageDataUrl = canvas.toDataURL("image/jpeg");
//       setImageUrl(imageDataUrl);

//       // Stop camera stream
//       const stream = video.srcObject as MediaStream;
//       stream.getTracks().forEach((track) => track.stop());

//       // Convert dataURL to file
//       fetch(imageDataUrl)
//         .then((res) => res.blob())
//         .then((blob) => {
//           const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
//           processImage(file);
//         });

//       setScanState("processing");
//     }
//   };

//   const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setScanState("processing");
//       const url = URL.createObjectURL(file);
//       setImageUrl(url);
//       processImage(file);
//     }
//   };

//   const processImage = async (file: File) => {
//     try {
//       const formData = new FormData();
//       formData.append("image", file);

//       const response = await fetch("http://localhost:5000/analyze", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }

//       const data = await response.json();

//       const mappedResult: SkinAnalysisResult = {
//         skin_type: data.predicted_skin_type,
//         conditions: Object.keys(data.skin_conditions),
//         skin_score: Math.round(data.overall_skin_condition_score),
//         recommended_chapter: 1,
//       };

//       setAnalysisResult(mappedResult);
//       setScanState("complete");
//     } catch (error) {
//       console.error("Error analyzing image:", error);
//       toast({
//         title: "Analysis failed",
//         description:
//           "There was a problem analyzing your skin. Please try again.",
//         variant: "destructive",
//       });
//       setScanState("initial");
//     }
//   };

//   const handleReset = () => {
//     setScanState("initial");
//     setImageUrl(null);
//     setAnalysisResult(null);
//   };

//   const handleViewRecommendations = () => {
//     if (analysisResult) {
//       navigate(`/chapters/${analysisResult.recommended_chapter}`);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-grow container py-12">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
//             Skin Analysis
//           </h1>
//           <p className="text-center text-muted-foreground mb-8">
//             Get your personalized skin profile and recommendations
//           </p>

//           <Card className="overflow-hidden bg-white dark:bg-secondary/20 shadow-lg border-0">
//             <CardContent className="p-0">
//               <div className="p-6 md:p-8 bg-gradient-to-b from-skin-purple/10 to-transparent">
//                 <h2 className="text-2xl font-semibold mb-1">Face Scan</h2>
//                 <p className="text-muted-foreground mb-6">
//                   Upload or capture a well-lit, front-facing photo of your face
//                 </p>

//                 {scanState === "initial" && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Button
//                       onClick={handleCapture}
//                       className="h-auto py-6 flex flex-col gap-2"
//                     >
//                       <Camera className="h-6 w-6" />
//                       <span>Capture with Camera</span>
//                     </Button>

//                     <Button
//                       variant="outline"
//                       className="w-full h-auto py-6 flex flex-col gap-2"
//                       onClick={() => fileInputRef.current?.click()}
//                     >
//                       <Upload className="h-6 w-6" />
//                       <span>Upload a Photo</span>
//                     </Button>
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept="image/*"
//                       onChange={handleUpload}
//                       className="hidden"
//                     />
//                   </div>
//                 )}

//                 {scanState === "capturing" && (
//                   <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
//                     <video
//                       ref={videoRef}
//                       autoPlay
//                       playsInline
//                       className="w-full h-full object-cover rounded-lg"
//                     />
//                   </div>
//                 )}

//                 {scanState === "countdown" && (
//                   <div className="relative bg-black rounded-lg aspect-video flex items-center justify-center">
//                     <video
//                       ref={videoRef}
//                       autoPlay
//                       playsInline
//                       className="w-full h-full object-cover rounded-lg"
//                     />
//                     {countdown !== null && (
//                       <div className="absolute text-white text-6xl font-bold bg-black/50 rounded-full px-6 py-4">
//                         {countdown}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {(scanState === "processing" || scanState === "complete") && (
//                   <div className="space-y-6">
//                     <div className="relative overflow-hidden rounded-lg">
//                       {imageUrl && (
//                         <img
//                           src={imageUrl}
//                           alt="Captured face"
//                           className="w-full h-auto"
//                         />
//                       )}

//                       {scanState === "processing" && (
//                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                           <div className="text-center text-white">
//                             <RefreshCw className="h-10 w-10 mx-auto animate-spin" />
//                             <p className="mt-2">Analyzing your skin...</p>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {scanState === "complete" && analysisResult && (
//                       <div className="space-y-6">
//                         {/* Skin type */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           <div className="bg-skin-purple/10 p-6 rounded-xl">
//                             <h3 className="text-xl font-semibold mb-4">
//                               Your Skin Type
//                             </h3>
//                             <div className="space-y-2">
//                               <div className="flex justify-between items-center">
//                                 <span>{analysisResult.skin_type}</span>
//                               </div>
//                             </div>
//                           </div>
//                           {/* Skin conditions */}
//                           <div className="bg-skin-peach/10 p-6 rounded-xl">
//                             <h3 className="text-xl font-semibold mb-4">
//                               Skin Conditions
//                             </h3>
//                             <ul className="space-y-2">
//                               {analysisResult.conditions.map(
//                                 (condition, index) => (
//                                   <li
//                                     key={index}
//                                     className="flex justify-between"
//                                   >
//                                     <span>{condition}</span>
//                                     <span className="font-semibold">
//                                       {index === 0
//                                         ? "Prominent"
//                                         : index === 1
//                                         ? "Moderate"
//                                         : "Mild"}
//                                     </span>
//                                   </li>
//                                 )
//                               )}
//                             </ul>
//                           </div>
//                         </div>
//                         {/* Skin score */}
//                         <div className="bg-white p-6 rounded-xl border shadow-sm">
//                           <h3 className="text-xl font-semibold mb-2">
//                             Your Skin Score
//                           </h3>
//                           <div className="flex items-center gap-4">
//                             <div className="h-16 w-16 rounded-full bg-skin-purple flex items-center justify-center text-white text-2xl font-bold">
//                               {analysisResult.skin_score}
//                             </div>
//                             <div className="flex-1">
//                               <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
//                                 <div
//                                   className="h-full bg-skin-purple rounded-full"
//                                   style={{
//                                     width: `${analysisResult.skin_score}%`,
//                                   }}
//                                 ></div>
//                               </div>
//                               <div className="flex justify-between mt-1 text-sm text-muted-foreground">
//                                 <span>Needs attention</span>
//                                 <span>Good</span>
//                                 <span>Excellent</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex flex-col sm:flex-row gap-3">
//                           <Button
//                             onClick={handleViewRecommendations}
//                             className="flex-1"
//                           >
//                             View Recommendations
//                           </Button>
//                           <Button variant="outline" onClick={handleReset}>
//                             Scan Again
//                           </Button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <canvas ref={canvasRef} className="hidden"></canvas>
//             </CardContent>
//           </Card>

//           <div className="mt-8 p-6 rounded-xl bg-secondary/50 text-center">
//             <h3 className="text-lg font-semibold mb-2">Scan Instructions</h3>
//             <ul className="text-muted-foreground text-left list-disc pl-6 space-y-1 max-w-xl mx-auto">
//               <li>Use natural lighting for the most accurate analysis</li>
//               <li>Remove makeup and glasses before scanning</li>
//               <li>Keep a neutral expression with your face centered</li>
//               <li>For best results, avoid filters or edited photos</li>
//             </ul>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default ScanPage;

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { SkinAnalysisResult } from "@/services/skinAnalysisService";
import { auth } from "../lib/firebaseConfig";


type ScanState = "initial" | "capturing" | "processing" | "complete";

const ScanPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanState>("initial");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<SkinAnalysisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCapture = async () => {
    setScanState("capturing");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      toast({
        title: "Camera error",
        description: "Please allow camera access to take a photo.",
        variant: "destructive",
      });
      setScanState("initial");
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        setScanState("processing");

        // 🔹 Stop camera immediately after taking the photo
        if (videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream)
            .getTracks()
            .forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }

        processImage(file);
      }
    }, "image/jpeg");
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScanState("processing");
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      processImage(file);
    }
  };

  const processImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const mappedResult: SkinAnalysisResult = {
        skin_type: data.predicted_skin_type,
        conditions: Object.keys(data.skin_conditions),
        skin_score: Math.round(data.overall_skin_condition_score),
        recommended_chapter: 1,
      };

      setAnalysisResult(mappedResult);
      setScanState("complete");
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis failed",
        description:
          "There was a problem analyzing your skin. Please try again.",
        variant: "destructive",
      });
      setScanState("initial");
    }
  };

  const handleReset = () => {
    // Stop the camera if still running
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    setScanState("initial");
    setImageUrl(null);
    setAnalysisResult(null);
  };

  const handleViewRecommendations = () => {
    if (analysisResult) {
      navigate(`/chapters/${analysisResult.recommended_chapter}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
            Skin Analysis
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Get your personalized skin profile and recommendations
          </p>

          <Card className="overflow-hidden bg-white dark:bg-secondary/20 shadow-lg border-0">
            <CardContent className="p-0">
              <div className="p-6 md:p-8 bg-gradient-to-b from-skin-purple/10 to-transparent">
                <h2 className="text-2xl font-semibold mb-1">Face Scan</h2>
                <p className="text-muted-foreground mb-6">
                  Upload or capture a well-lit, front-facing photo of your face
                </p>

                {scanState === "initial" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={handleCapture}
                      className="h-auto py-6 flex flex-col gap-2"
                    >
                      <Camera className="h-6 w-6" />
                      <span>Capture with Camera</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-auto py-6 flex flex-col gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-6 w-6" />
                      <span>Upload a Photo</span>
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      className="hidden"
                    />
                  </div>
                )}

                {scanState === "capturing" && (
                  <div className="space-y-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg border"
                    />
                    <Button onClick={takePhoto} className="w-full">
                      Take Photo
                    </Button>
                  </div>
                )}

                {(scanState === "processing" || scanState === "complete") && (
                  <div className="space-y-6">
                    <div className="relative overflow-hidden rounded-lg">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt="Captured face"
                          className="w-full h-auto"
                        />
                      )}
                      {scanState === "processing" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-center text-white">
                            <RefreshCw className="h-10 w-10 mx-auto animate-spin" />
                            <p className="mt-2">Analyzing your skin...</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {scanState === "complete" && analysisResult && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-skin-purple/10 p-6 rounded-xl">
                            <h3 className="text-xl font-semibold mb-4">
                              Your Skin Type
                            </h3>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span>{analysisResult.skin_type}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-skin-peach/10 p-6 rounded-xl">
                            <h3 className="text-xl font-semibold mb-4">
                              Skin Conditions
                            </h3>
                            <ul className="space-y-2">
                              {analysisResult.conditions.map(
                                (condition, index) => (
                                  <li
                                    key={index}
                                    className="flex justify-between"
                                  >
                                    <span>{condition}</span>
                                    <span className="font-semibold">
                                      {index === 0
                                        ? "Prominent"
                                        : index === 1
                                          ? "Moderate"
                                          : "Mild"}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                          <h3 className="text-xl font-semibold mb-2">
                            Your Skin Score
                          </h3>
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-skin-purple flex items-center justify-center text-white text-2xl font-bold">
                              {analysisResult.skin_score}
                            </div>
                            <div className="flex-1">
                              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-skin-purple rounded-full"
                                  style={{
                                    width: `${analysisResult.skin_score}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                                <span>Needs attention</span>
                                <span>Good</span>
                                <span>Excellent</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={handleViewRecommendations}
                            className="flex-1"
                          >
                            View Recommendations
                          </Button>
                          <Button variant="outline" onClick={handleReset}>
                            Scan Again
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 p-6 rounded-xl bg-secondary/50 text-center">
            <h3 className="text-lg font-semibold mb-2">Scan Instructions</h3>
            <ul className="text-muted-foreground text-left list-disc pl-6 space-y-1 max-w-xl mx-auto">
              <li>Use natural lighting for the most accurate analysis</li>
              <li>Remove makeup and glasses before scanning</li>
              <li>Keep a neutral expression with your face centered</li>
              <li>For best results, avoid filters or edited photos</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScanPage;
