import { GoogleGenAI, Type } from "@google/genai";
import { GrammarLesson } from "../types";

// ------------------------------------------------------------------
// Environment Variable Handling for Vercel/Vite & Sandbox
// ------------------------------------------------------------------
// We access these at the top level to ensure the build tool (Vite)
// can statically replace them during the build process.

// @ts-ignore
const VITE_API_KEY = import.meta.env?.VITE_API_KEY;
// @ts-ignore
const VITE_GOOGLE_API_KEY = import.meta.env?.VITE_GOOGLE_API_KEY;
// @ts-ignore
const VITE_GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY;
// @ts-ignore
const VITE_STD_API_KEY = import.meta.env?.API_KEY;

// Fallback for Node.js / Sandbox environments
let PROCESS_API_KEY = "";
try {
  if (typeof process !== "undefined" && process.env) {
    PROCESS_API_KEY = process.env.API_KEY || "";
  }
} catch (e) {
  // Ignore reference errors
}

const FINAL_API_KEY = VITE_API_KEY || VITE_GOOGLE_API_KEY || VITE_GEMINI_API_KEY || VITE_STD_API_KEY || PROCESS_API_KEY || "";

export const getDebugInfo = () => {
  return {
    VITE_API_KEY: !!VITE_API_KEY,
    VITE_GOOGLE_API_KEY: !!VITE_GOOGLE_API_KEY,
    VITE_GEMINI_API_KEY: !!VITE_GEMINI_API_KEY,
    API_KEY_META: !!VITE_STD_API_KEY,
    PROCESS_KEY: !!PROCESS_API_KEY,
    KEY_LENGTH: FINAL_API_KEY.length,
    ENV_TYPE: typeof import.meta !== "undefined" ? "import.meta available" : "import.meta missing"
  };
};

export const fetchGrammarLesson = async (
  grade: number,
  topicTitle: string,
  topicDescription: string
): Promise<GrammarLesson> => {
  const modelId = "gemini-2.5-flash"; // Using flash for speed

  const apiKey = FINAL_API_KEY;
  
  if (!apiKey) {
    console.error("API Key is missing. Debug Info:", getDebugInfo());
    throw new Error("API Key is missing. Please check your deployment settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Create a structured grammar lesson for:
    Grade: Middle School Year ${grade}
    Topic: ${topicTitle} (${topicDescription})

    The content must be in Korean (explanations) and English (examples).
    The tone should be encouraging, clear, and easy to understand for a teenager.

    Requirements:
    1. A concise summary of the grammar point.
    2. 3-4 key bullet points explaining the rules (Use Korean).
    3. 3 excellent example sentences with Korean translations.
    4. A single multiple-choice quiz question to test understanding.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert English teacher for Korean middle school students. You explain grammar concepts simply and clearly.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING, description: "The title of the lesson" },
            summary: { type: Type.STRING, description: "A brief summary of the grammar concept in Korean" },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of key grammatical rules or explanations in Korean"
            },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  english: { type: Type.STRING },
                  korean: { type: Type.STRING }
                }
              },
              description: "Example sentences"
            },
            quiz: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "The quiz question" },
                options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 multiple choice options" },
                correctAnswerIndex: { type: Type.INTEGER, description: "The index of the correct answer (0-3)" },
                explanation: { type: Type.STRING, description: "Explanation of why the answer is correct" }
              }
            }
          },
          required: ["topic", "summary", "keyPoints", "examples", "quiz"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GrammarLesson;
    }
    throw new Error("No content generated");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};