import { GoogleGenAI, Type } from "@google/genai";
import { GrammarLesson } from "../types";

export const fetchGrammarLesson = async (
  grade: number,
  topicTitle: string,
  topicDescription: string
): Promise<GrammarLesson> => {
  // Lazy initialization of API Key
  // This ensures we check for the key at runtime (when button is clicked), 
  // preventing 'process is not defined' errors during initial page load.
  let apiKey = '';

  try {
    // 1. Try standard Vite environment variables
    // @ts-ignore
    if (import.meta.env.VITE_API_KEY) apiKey = import.meta.env.VITE_API_KEY;
    // @ts-ignore
    else if (import.meta.env.API_KEY) apiKey = import.meta.env.API_KEY;
  } catch (e) {
    // import.meta might not be available in all environments
  }

  // 2. Fallback to process.env (Vercel / Node.js)
  // We check for process existence to avoid ReferenceError in browsers
  if (!apiKey) {
    try {
      if (typeof process !== 'undefined' && process.env) {
        if (process.env.API_KEY) apiKey = process.env.API_KEY;
        else if (process.env.REACT_APP_API_KEY) apiKey = process.env.REACT_APP_API_KEY;
      }
    } catch (e) {
      // process might not be available
    }
  }

  if (!apiKey) {
    console.error("API Key missing. Checked: VITE_API_KEY, API_KEY, process.env.API_KEY");
    throw new Error("API Key configuration not found. Please set VITE_API_KEY in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-2.5-flash";

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