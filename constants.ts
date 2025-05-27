import { QuizQuestionData } from './types';

// INITIAL_QUESTIONS is initialized as an empty array.
// The actual initial questions will be loaded from questions.json in App.tsx
// if no questions are found in localStorage.
export const INITIAL_QUESTIONS: QuizQuestionData[] = [];

export const GEMINI_API_MODEL_TEXT = 'gemini-2.5-flash-preview-05-20';
