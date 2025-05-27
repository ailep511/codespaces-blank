
import React, { useState } from 'react';
import { generateQuizQuestionsWithGemini, isGeminiApiKeyAvailable } from '../services/geminiService';
import { QuizQuestionData } from '../types';
import { SparklesIcon, InformationCircleIcon } from './icons';

interface GeminiGeneratorProps {
  onQuestionsGenerated: (newQuestions: QuizQuestionData[]) => void;
}

const GeminiGenerator: React.FC<GeminiGeneratorProps> = ({ onQuestionsGenerated }) => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(3); // Default to 3 questions
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geminiAvailable = isGeminiApiKeyAvailable();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || count <= 0 || !geminiAvailable) return;

    setIsLoading(true);
    setError(null);
    try {
      const newQuestions = await generateQuizQuestionsWithGemini(topic, count);
      onQuestionsGenerated(newQuestions);
      setTopic(''); 
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!geminiAvailable) {
    return (
      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-600/50 rounded-lg text-amber-700 dark:text-amber-400">
        <div className="flex items-center">
          <InformationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-sm">
            Gemini API key (API_KEY environment variable) is not configured. AI question generation feature is unavailable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
        <SparklesIcon className="w-5 h-5 mr-2 text-sky-500 dark:text-sky-400" />
        Generate Questions with AI
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-600 dark:text-slate-400">
            Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 transition bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="e.g., AWS Cloud Services"
            required
          />
        </div>
        <div>
          <label htmlFor="count" className="block text-sm font-medium text-slate-600 dark:text-slate-400">
            Number of Questions
          </label>
          <input
            type="number"
            id="count"
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
            min="1"
            max="10" 
            className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 transition bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-md shadow-sm transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Questions'
          )}
        </button>
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </form>
    </div>
  );
};

export default GeminiGenerator;
