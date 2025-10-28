import React from 'react';
import { QuizQuestionData } from '../types';
import { PencilIcon, TrashIcon } from './icons';

interface QuestionListProps {
  questions: QuizQuestionData[];
  onEdit: (question: QuizQuestionData) => void;
  onDelete: (id: string) => void;
  currentQuestionId?: string | null;
  onSelectQuestion: (index: number) => void;
  isLoading?: boolean;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onEdit, onDelete, currentQuestionId, onSelectQuestion, isLoading }) => {
  if (isLoading) {
    return <p className="text-slate-500 dark:text-slate-400 text-center py-4">Loading questions...</p>;
  }
  
  if (questions.length === 0) {
    return <p className="text-slate-500 dark:text-slate-400 text-center py-4">No questions in this quiz yet.</p>;
  }

  return (
    <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
      {questions.map((question, index) => (
        <div
          key={question.id}
          onClick={() => onSelectQuestion(index)}
          className={`p-4 rounded-lg shadow-md cursor-pointer transition-all
                      ${question.id === currentQuestionId 
                        ? 'bg-sky-100 dark:bg-sky-700/40 border-sky-500 dark:border-sky-500 border-2' 
                        : 'bg-white dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-600'}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate" title={question.question}>
                {index + 1}. {question.question}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate" title={`Correct: ${question.options[question.correctAnswerKey]}`}>
                Correct: {question.options[question.correctAnswerKey]}
              </p>
            </div>
            <div className="flex space-x-2 ml-2 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(question); }}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition rounded-full hover:bg-sky-100 dark:hover:bg-sky-700/50"
                aria-label={`Edit question: ${question.question}`}
              >
                <PencilIcon />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(question.id); }}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition rounded-full hover:bg-red-100 dark:hover:bg-red-700/50"
                aria-label={`Delete question: ${question.question}`}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
