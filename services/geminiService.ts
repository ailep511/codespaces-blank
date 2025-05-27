import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { QuizQuestionData, GeminiQuizQuestionSuggestion } from '../types';
import { GEMINI_API_MODEL_TEXT } from '../constants';

const API_KEY = process.env.API_KEY;

export const isGeminiApiKeyAvailable = (): boolean => {
  return !!API_KEY;
};

export const generateQuizQuestionsWithGemini = async (topic: string, count: number): Promise<QuizQuestionData[]> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `Generate ${count} quiz questions on the topic of "${topic}".
Each question must have:
1.  A "question" (string).
2.  An "options" object (string to string map, e.g., {"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"}). Provide 3 to 4 options.
3.  A "correctAnswerKey" (string, e.g., "A", corresponding to one of the keys in "options").
4.  An "explanation" (string, explaining why the answer is correct).

Provide the output as a JSON array of objects adhering to this structure.
Example: 
[
  {
    "question": "What is the capital of France?",
    "options": {
      "A": "Berlin",
      "B": "Madrid",
      "C": "Paris",
      "D": "Rome"
    },
    "correctAnswerKey": "C",
    "explanation": "Paris is the capital and most populous city of France."
  }
]`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_API_MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6, // Slightly less creative for factual quiz questions
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as GeminiQuizQuestionSuggestion[];

    if (!Array.isArray(parsedData) || !parsedData.every(item => 
        typeof item.question === 'string' &&
        typeof item.options === 'object' && Object.keys(item.options).length > 0 &&
        typeof item.correctAnswerKey === 'string' &&
        item.options.hasOwnProperty(item.correctAnswerKey) &&
        typeof item.explanation === 'string'
    )) {
      console.error("Invalid data structure received from Gemini:", parsedData);
      throw new Error("Invalid format received from Gemini API. Expected an array of {question, options, correctAnswerKey, explanation}.");
    }
    
    return parsedData.map((suggestion, index) => ({
      id: `gemini-quiz-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`,
      question: suggestion.question,
      options: suggestion.options,
      correctAnswerKey: suggestion.correctAnswerKey,
      explanation: suggestion.explanation,
    }));

  } catch (error) {
    console.error("Error generating quiz questions with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate quiz questions: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating quiz questions with Gemini.");
  }
};
