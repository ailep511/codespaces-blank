import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ArrowsRightLeftIcon } from './icons';

interface ControlsProps {
  onPrev?: () => void; 
  onNext?: () => void; 
  onShuffle?: () => void; 
  canPrev: boolean;
  canNext: boolean;
  questionCount: number;
  nextButtonText?: string;
  prevButtonText?: string;
  isQuizActive?: boolean; 
}

const ControlButton: React.FC<{ 
  onClick?: () => void; 
  disabled?: boolean; 
  children: React.ReactNode; 
  ariaLabel: string; 
  className?: string 
}> = ({ onClick, disabled, children, ariaLabel, className }) => (
  <button
    onClick={onClick}
    disabled={!onClick || disabled}
    aria-label={ariaLabel}
    className={`p-3 bg-white dark:bg-slate-700 rounded-lg shadow hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center justify-center ${className}`}
  >
    {children}
  </button>
);

const Controls: React.FC<ControlsProps> = ({
  onPrev,
  onNext,
  onShuffle,
  canPrev,
  canNext,
  questionCount,
  nextButtonText = "Next",
  prevButtonText = "Previous",
  isQuizActive = false,
}) => {
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {onPrev && (
        <ControlButton onClick={onPrev} disabled={!canPrev || questionCount === 0} ariaLabel="Previous question" className="sm:col-span-1">
          <ChevronLeftIcon />
          <span className="ml-2 hidden sm:inline">{prevButtonText}</span>
        </ControlButton>
      )}
      
      {onShuffle && (
         <ControlButton onClick={onShuffle} disabled={questionCount < 2 || isQuizActive} ariaLabel="Shuffle questions" className={`sm:col-span-1 ${!onPrev || !onNext ? 'col-span-2 sm:col-span-1' : ''}`}>
            <ArrowsRightLeftIcon />
            <span className="ml-2 hidden sm:inline">Shuffle</span>
        </ControlButton>
      )}

      {onNext && (
        <ControlButton onClick={onNext} disabled={!canNext || questionCount === 0} ariaLabel="Next question" className="sm:col-span-1">
          <span className="mr-2 hidden sm:inline">{nextButtonText}</span>
          <ChevronRightIcon />
        </ControlButton>
      )}
    </div>
  );
};

export default Controls;
