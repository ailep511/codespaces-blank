import React from 'react';
import { QuizQuestionData } from '../types';

interface QuizQuestionDisplayProps {
  questionData: QuizQuestionData | null;
  selectedOptionKey: string | null;
  isAnswerSubmitted: boolean;
  onOptionSelect: (optionKey: string) => void;
  showExplanation?: boolean;
}

const QuizQuestionDisplay: React.FC<QuizQuestionDisplayProps> = ({
  questionData,
  selectedOptionKey,
  isAnswerSubmitted,
  onOptionSelect,
  showExplanation = true,
}) => {
  if (!questionData) {
    return (
      <div className="w-full min-h-[20rem] md:min-h-[24rem] bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center p-6 text-slate-500 dark:text-slate-400">
        No questions available. Add some questions to start the quiz!
      </div>
    );
  }

  const { question, options, correctAnswerKey, explanation } = questionData;

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1 font-semibold">Question</p>
        {/* Removed font-bold from question paragraph */}
        <p className="text-lg md:text-xl text-slate-800 dark:text-slate-200 whitespace-pre-line">{question}</p>
      </div>

      <div className="space-y-3 mb-6">
        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-semibold">Options</p>
        {Object.entries(options).map(([key, text]) => {
          const isSelected = selectedOptionKey === key;
          const isCorrect = key === correctAnswerKey;
          
          let buttonClass = "w-full text-left p-3 border rounded-lg transition-all duration-150 ease-in-out text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400";
          
          if (isAnswerSubmitted) {
            if (isCorrect) {
              buttonClass += " bg-emerald-100 dark:bg-emerald-700/30 border-emerald-500 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold";
            } else if (isSelected && !isCorrect) {
              buttonClass += " bg-red-100 dark:bg-red-700/30 border-red-500 dark:border-red-500 text-red-800 dark:text-red-300 font-semibold";
            } else {
              buttonClass += " border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 opacity-70 dark:opacity-60";
            }
          } else {
             buttonClass += isSelected ? " bg-sky-100 dark:bg-sky-700/30 border-sky-500 dark:border-sky-400 ring-2 ring-sky-500 dark:ring-sky-400" : " border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/20";
          }

          return (
            <button
              key={key}
              onClick={() => onOptionSelect(key)}
              disabled={isAnswerSubmitted}
              className={buttonClass}
              aria-pressed={isSelected}
            >
              <span className={`font-semibold mr-2 ${isAnswerSubmitted && (isCorrect || (isSelected && !isCorrect)) ? '' : 'text-sky-600 dark:text-sky-400'}`}>{key}.</span>
              {/* Option text remains font-bold */}
              <span className="whitespace-pre-line font-bold">{text}</span>
            </button>
          );
        })}
      </div>

      {isAnswerSubmitted && (
        <div className="mt-4 text-center">
          {selectedOptionKey === correctAnswerKey ? (
            <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">CORRECT</p>
          ) : (
            <p className="text-xl font-semibold text-red-600 dark:text-red-400">INCORRECT</p>
          )}
        </div>
      )}

      {isAnswerSubmitted && showExplanation && (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
          <p className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 font-semibold">Explanation</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestionDisplay;
