
/**
 * Service responsible for communicating with the skin analysis backend API
 */

export interface SkinAnalysisResult {
  skin_type: string;
  conditions: string[];
  skin_score: number;
  recommended_chapter: number;
}

// Define your API endpoint here (this should be your deployed backend URL)
const API_URL = "https://api.skinchapters.example/analyze_skin";

/**
 * Sends an image to the backend for skin analysis
 * @param image The image file to analyze
 * @returns The analysis results
 */
export const analyzeSkin = async (imageFile: File): Promise<SkinAnalysisResult> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      // Handle error responses from the server
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to analyze skin');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing skin:', error);
    throw error;
  }
};

/**
 * For local development or testing when backend is not available
 * @param imageFile The image file to analyze
 * @returns Mock analysis results
 */
export const analyzeSkinMock = async (imageFile: File): Promise<SkinAnalysisResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generate random conditions based on file size for variety
  const fileSize = imageFile.size;
  const conditions = [];
  
  if (fileSize % 2 === 0) conditions.push("Mild acne");
  if (fileSize % 3 === 0) conditions.push("Dryness around cheeks");
  if (fileSize % 5 === 0) conditions.push("T-zone oiliness");
  if (fileSize % 7 === 0) conditions.push("Fine lines");
  if (conditions.length === 0) conditions.push("Balanced skin");
  
  // Determine skin type based on file type
  const skinTypes = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];
  const skinTypeIndex = Math.floor((fileSize % 5));
  const skinType = skinTypes[skinTypeIndex];
  
  // Calculate skin score (60-95 range)
  const skinScore = Math.floor(60 + (fileSize % 35));
  
  // Recommend chapter based on conditions
  let recommendedChapter = 1;
  if (conditions.includes("Mild acne")) recommendedChapter = 6; // Repair & Recovery
  else if (conditions.includes("Dryness around cheeks")) recommendedChapter = 1; // Hydration
  else if (conditions.includes("Fine lines")) recommendedChapter = 2; // Repair
  else if (conditions.includes("T-zone oiliness")) recommendedChapter = 3; // Protection
  else recommendedChapter = 5; // Brightening & Glow
  
  return {
    skin_type: skinType,
    conditions: conditions,
    skin_score: skinScore,
    recommended_chapter: recommendedChapter
  };
};
