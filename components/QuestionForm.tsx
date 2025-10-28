import React, { useState, useEffect } from 'react';
import { QuizQuestionData } from '../types';

interface QuestionFormProps {
  onSubmit: (questionData: Omit<QuizQuestionData, 'id'>) => void;
  onCancel: () => void;
  initialData?: QuizQuestionData | null;
}

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6; // Max number of options (A-F)

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<{ [key: string]: string }>({ A: '', B: '' });
  const [correctAnswerKey, setCorrectAnswerKey] = useState<string>('A');
  const [explanation, setExplanation] = useState('');
  const [optionKeys, setOptionKeys] = useState<string[]>(['A', 'B']); // To maintain order and handle dynamic options

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question);
      setOptions(initialData.options);
      const currentOptionKeys = Object.keys(initialData.options).sort();
      setOptionKeys(currentOptionKeys);
      setCorrectAnswerKey(initialData.correctAnswerKey);
      setExplanation(initialData.explanation);
    } else {
      setQuestion('');
      const defaultOpts = { A: '', B: '' };
      setOptions(defaultOpts);
      setOptionKeys(Object.keys(defaultOpts));
      setCorrectAnswerKey('A');
      setExplanation('');
    }
  }, [initialData]);

  const handleOptionChange = (key: string, value: string) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const getNextOptionKey = () => {
    if (optionKeys.length === 0) return 'A';
    const lastKey = optionKeys[optionKeys.length - 1];
    return String.fromCharCode(lastKey.charCodeAt(0) + 1);
  };

  const addOption = () => {
    if (optionKeys.length < MAX_OPTIONS) {
      const nextKey = getNextOptionKey();
      setOptionKeys(prevKeys => [...prevKeys, nextKey]);
      setOptions(prevOpts => ({...prevOpts, [nextKey]: ''}));
    }
  };
  
  const removeOption = (keyToRemove: string) => {
    if (optionKeys.length > MIN_OPTIONS) {
      setOptionKeys(prevKeys => prevKeys.filter(k => k !== keyToRemove));
      setOptions(prevOpts => {
        const newOpts = {...prevOpts};
        delete newOpts[keyToRemove];
        return newOpts;
      });
      if (correctAnswerKey === keyToRemove && optionKeys.length > 1) {
        setCorrectAnswerKey(optionKeys.filter(k => k !== keyToRemove)[0]); // Default to first remaining
      }
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && explanation.trim() && 
        optionKeys.every(key => options[key]?.trim()) && 
        optionKeys.includes(correctAnswerKey)) {
      
      const finalOptions: { [key: string]: string } = {};
      optionKeys.forEach(key => {
        if (options[key]) finalOptions[key] = options[key];
      });

      onSubmit({ question, options: finalOptions, correctAnswerKey, explanation });
    } else {
      alert("Please fill in all fields, including all options, and select a correct answer.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 transition bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          placeholder="Enter the question"
          required
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Options</label>
        {optionKeys.map((key, index) => (
          <div key={key} className="flex items-center space-x-2">
            <span className="font-semibold text-slate-600 dark:text-slate-400">{key}.</span>
            <input
              type="text"
              value={options[key] || ''}
              onChange={(e) => handleOptionChange(key, e.target.value)}
              className="flex-grow p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 transition bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              placeholder={`Option ${key}`}
              required
            />
            <input
              type="radio"
              name="correctAnswer"
              id={`correctAnswer-${key}`}
              value={key}
              checked={correctAnswerKey === key}
              onChange={() => setCorrectAnswerKey(key)}
              className="form-radio h-5 w-5 text-sky-600 dark:text-sky-400 focus:ring-sky-500 dark:focus:ring-sky-400 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
              aria-label={`Mark option ${key} as correct`}
            />
             <label htmlFor={`correctAnswer-${key}`} className="text-sm text-slate-600 dark:text-slate-400">Correct</label>
            {optionKeys.length > MIN_OPTIONS && (
              <button 
                type="button" 
                onClick={() => removeOption(key)}
                className="p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                aria-label={`Remove option ${key}`}
              >
                &times;
              </button>
            )}
          </div>
        ))}
        {optionKeys.length < MAX_OPTIONS && (
          <button 
            type="button" 
            onClick={addOption}
            className="mt-2 px-3 py-1 text-sm text-sky-700 dark:text-sky-400 border border-sky-500 dark:border-sky-400 rounded-md hover:bg-sky-50 dark:hover:bg-sky-700/30 transition"
          >
            Add Option
          </button>
        )}
      </div>
      
      <div>
        <label htmlFor="explanation" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Explanation
        </label>
        <textarea
          id="explanation"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows={3}
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 dark:focus:ring-sky-400 dark:focus:border-sky-400 transition bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          placeholder="Explain why the answer is correct"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 rounded-md shadow-sm transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-md shadow-sm transition"
        >
          {initialData ? 'Save Changes' : 'Add Question'}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
