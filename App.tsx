
import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestionData } from './types';
// INITIAL_QUESTIONS from constants.ts is now an empty array.
// Actual initial questions will be loaded from questions.json if localStorage is empty.
import { INITIAL_QUESTIONS } from './constants'; 
import useLocalStorage from './hooks/useLocalStorage';
import QuizQuestionDisplay from './components/QuizQuestionDisplay';
import Controls from './components/Controls';
import QuestionList from './components/QuestionList';
import QuestionForm from './components/QuestionForm';
import Modal from './components/Modal';
import GeminiGenerator from './components/GeminiGenerator';
import { PlusIcon, SunIcon, MoonIcon } from './components/icons';

type QuizState = 'not_started' | 'idle' | 'active' | 'completed';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  // useLocalStorage will use INITIAL_QUESTIONS (empty array) if 'quizQuestions' isn't in localStorage.
  const [questions, setQuestions] = useLocalStorage<QuizQuestionData[]>('quizQuestions', INITIAL_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionKey, setSelectedOptionKey] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>('not_started');
  
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestionData | null>(null);

  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');

  const [isFetchingInitialJson, setIsFetchingInitialJson] = useState(false);
  const [initialJsonLoadAttempted, setInitialJsonLoadAttempted] = useState(false);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // This effect attempts to load from questions.json if localStorage was empty.
    // It should only run this core logic once or if questions become empty and load hasn't been attempted.
    if (!initialJsonLoadAttempted && questions.length === 0) {
      const fetchInitialData = async () => {
        setIsFetchingInitialJson(true);
        try {
          console.log("No questions in localStorage, attempting to fetch from questions.json...");
          const response = await fetch('./questions.json'); // Fetches from the root directory
          if (!response.ok) {
            throw new Error(`HTTP error ${response.status} fetching questions.json: ${response.statusText}`);
          }
          const rawQuestionsFromJson = await response.json();

          // Validate structure of fetched JSON
          if (Array.isArray(rawQuestionsFromJson) && rawQuestionsFromJson.every(q =>
            q && typeof q.question === 'string' &&
            typeof q.options === 'object' && Object.keys(q.options).length > 0 &&
            typeof q.correctAnswer === 'string' && q.options.hasOwnProperty(q.correctAnswer) && // 'correctAnswer' from JSON
            typeof q.explanation === 'string'
          )) {
            const formattedQuestions: QuizQuestionData[] = rawQuestionsFromJson.map((q: any, index: number) => ({
              id: `file-q-${Date.now()}-${index}`, // Generate unique ID
              question: q.question,
              options: q.options,
              correctAnswerKey: q.correctAnswer, // Map 'correctAnswer' to 'correctAnswerKey'
              explanation: q.explanation,
            }));
            setQuestions(formattedQuestions); // This updates state and localStorage
            console.log("Successfully populated questions from questions.json.");
          } else {
            console.error("Invalid data structure in questions.json. Initial questions will be empty.");
            // setQuestions([]); // questions is already empty
          }
        } catch (error) {
          console.error("Failed to load or parse questions.json:", error);
          // questions remains empty, user can still add questions manually
        } finally {
          setIsFetchingInitialJson(false);
          setInitialJsonLoadAttempted(true); // Mark that the attempt has been made
        }
      };
      fetchInitialData();
    } else if (!initialJsonLoadAttempted && questions.length > 0) {
      // Questions were found in localStorage, no need to fetch. Mark as attempted.
      setInitialJsonLoadAttempted(true);
      setIsFetchingInitialJson(false); 
    }
    // If initialJsonLoadAttempted is true, this effect does nothing further.
  }, [questions.length, setQuestions, initialJsonLoadAttempted]);


  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const currentQuestionData = questions.length > 0 ? questions[currentQuestionIndex] : null;

  useEffect(() => {
    if (quizState === 'active') {
      setSelectedOptionKey(null);
      setIsAnswerSubmitted(false);
    }
  }, [currentQuestionIndex, quizState]);
  
  useEffect(() => {
    // Ensure quizState is 'not_started' if questions become empty after being loaded.
    // Also, adjust currentQuestionIndex if it becomes out of bounds.
    if (initialJsonLoadAttempted || questions.length > 0) { // Only adjust after initial load attempt or if questions always existed
        if (quizState !== 'not_started' && questions.length === 0) {
          setQuizState('not_started');
          setCurrentQuestionIndex(0);
        } else if (currentQuestionIndex >= questions.length && questions.length > 0) {
          setCurrentQuestionIndex(questions.length - 1);
        } else if (currentQuestionIndex < 0 && questions.length > 0) {
          setCurrentQuestionIndex(0);
        }
    }
  }, [questions, currentQuestionIndex, quizState, initialJsonLoadAttempted]);


  const startQuiz = useCallback(() => {
    if (questions.length === 0) {
      if (quizState !== 'not_started') { // Avoid alert if already in not_started and trying to start
        alert("No questions available to start the quiz. Please add some questions first.");
      }
      return;
    }

    if (quizState === 'not_started' || quizState === 'completed') {
      setCurrentQuestionIndex(0); // Always start from the first question
    }
    // If quizState is 'idle', it will start from currentQuestionIndex
    
    setScore(0);
    setSelectedOptionKey(null);
    setIsAnswerSubmitted(false);
    setQuizState('active');
  }, [questions.length, quizState, /* currentQuestionIndex - removed to ensure startQuiz from welcome is always from 0 */]);

  const handleOptionSelect = useCallback((optionKey: string) => {
    if (!isAnswerSubmitted && quizState === 'active') {
      setSelectedOptionKey(optionKey);
    }
  }, [isAnswerSubmitted, quizState]);

  const handleSubmitAnswer = useCallback(() => {
    if (!selectedOptionKey || quizState !== 'active' || !currentQuestionData) return;

    setIsAnswerSubmitted(true);
    if (selectedOptionKey === currentQuestionData.correctAnswerKey) {
      setScore(prevScore => prevScore + 1);
    }
  }, [selectedOptionKey, quizState, currentQuestionData]);

  const handleNextQuestion = useCallback(() => {
    if (quizState !== 'active' || !currentQuestionData) return;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizState('completed');
    }
  }, [quizState, currentQuestionIndex, questions.length, currentQuestionData]);

  const handlePrevQuestion = useCallback(() => {
     if (quizState === 'idle' && currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        setSelectedOptionKey(null); 
        setIsAnswerSubmitted(false); 
     }
  },[quizState, currentQuestionIndex]);


  const handleShuffleQuestions = useCallback(() => {
    if (questions.length > 1 && quizState !== 'active') { 
      const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
      setCurrentQuestionIndex(0); 
      setSelectedOptionKey(null);
      setIsAnswerSubmitted(false);
      if (quizState !== 'not_started') {
        setQuizState('idle');
      }
    }
  }, [questions, setQuestions, quizState]);

  const handleAddQuestion = (newQuestionData: Omit<QuizQuestionData, 'id'>) => {
    const newQuestion: QuizQuestionData = {
      ...newQuestionData,
      id: `question-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };
    const newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
    
    if (quizState === 'not_started' || quizState === 'idle') {
      setCurrentQuestionIndex(newQuestions.length - 1); 
      setQuizState('idle');
    }
    setShowQuestionModal(false);
  };

  const handleEditQuestion = (updatedQuestionData: Omit<QuizQuestionData, 'id'>) => {
    if (editingQuestion) {
      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q.id === editingQuestion.id ? { ...q, ...updatedQuestionData, id: q.id } : q
        )
      );
      setEditingQuestion(null);
      setShowQuestionModal(false);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const oldLength = questions.length;
      const deletedQuestionOriginalIndex = questions.findIndex(q => q.id === id);
      const newQuestions = questions.filter(q => q.id !== id);
      setQuestions(newQuestions);
      
      if (quizState === 'active') {
        alert("Question deleted. Quiz state might be affected. Consider restarting the quiz if issues arise.");
        if (newQuestions.length === 0) {
          setQuizState('not_started'); 
          setCurrentQuestionIndex(0);
        } else if (currentQuestionIndex >= newQuestions.length) {
          setCurrentQuestionIndex(Math.max(0, newQuestions.length - 1));
        }
        if(currentQuestionData?.id === id) {
            setSelectedOptionKey(null);
            setIsAnswerSubmitted(false);
        }

      } else if (quizState === 'idle' || quizState === 'not_started') {
         if (newQuestions.length === 0) {
            setQuizState('not_started');
            setCurrentQuestionIndex(0);
         } else if (currentQuestionIndex === deletedQuestionOriginalIndex && currentQuestionIndex >= oldLength -1){
            setCurrentQuestionIndex(prev => Math.max(0, prev -1));
         } else if (deletedQuestionOriginalIndex < currentQuestionIndex) {
            setCurrentQuestionIndex(prev => prev-1);
         } else if (currentQuestionIndex >= newQuestions.length) {
            setCurrentQuestionIndex(Math.max(0, newQuestions.length-1));
         }
         if (quizState === 'idle' && newQuestions.length === 0) setQuizState('not_started');
         else if (quizState === 'not_started' && newQuestions.length > 0 && (initialJsonLoadAttempted || questions.length > 0)) setQuizState('idle'); 
         else if (quizState === 'idle' && newQuestions.length > 0 && currentQuestionIndex >= newQuestions.length) {
            setCurrentQuestionIndex(newQuestions.length - 1);
         } else if (quizState === 'idle' && newQuestions.length > 0 && currentQuestionIndex < 0) {
           setCurrentQuestionIndex(0);
         }
      }
    }
  };

  const openAddModal = () => {
    setEditingQuestion(null);
    setShowQuestionModal(true);
  };

  const openEditModal = (question: QuizQuestionData) => {
    setEditingQuestion(question);
    setShowQuestionModal(true);
  };
  
  const handleSelectQuestionFromList = (index: number) => {
    if (quizState === 'active' && !window.confirm("Selecting a question will end the current quiz and display the selected question. Continue?")) {
        return;
    }
    setCurrentQuestionIndex(index);
    setSelectedOptionKey(null);
    setIsAnswerSubmitted(false);
    setQuizState('idle'); 
  };

  const handleQuestionsGenerated = (newGeneratedQuestions: QuizQuestionData[]) => {
    const updatedQuestions = [...questions, ...newGeneratedQuestions];
    setQuestions(updatedQuestions);
    if (quizState === 'not_started' || quizState === 'idle') {
        if (updatedQuestions.length > 0) {
            setCurrentQuestionIndex(questions.length); // Point to the first of the new questions
            setQuizState('idle');
        }
    }
  };

  const renderNotStartedContent = () => {
    if (isFetchingInitialJson) {
      return <p className="text-xl text-slate-700 dark:text-slate-300 mb-6">Loading initial questions...</p>;
    }
    if (questions.length > 0) {
      return (
        <>
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-6">
            This quiz contains <span className="font-bold">{questions.length}</span> challenging questions.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">Ready to test your knowledge?</p>
          <button
            onClick={startQuiz}
            className="px-8 py-3 text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-md shadow-sm transition"
          >
            Start Quiz
          </button>
        </>
      );
    }
    // This case means fetching is done (or wasn't needed) and there are still no questions.
    if (initialJsonLoadAttempted || !isFetchingInitialJson) { // ensure load attempt is complete
      return (
         <>
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-6">
            There are no questions in the quiz yet.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            {initialJsonLoadAttempted && questions.length === 0 && !isFetchingInitialJson 
              ? "Failed to load initial questions or questions.json is empty. " 
              : ""}
            Please add some questions using the panel on the right to begin.
          </p>
        </>
      );
    }
    return null; // Should be covered by isFetchingInitialJson
  };


  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <header className="text-center mb-10 relative">
        <h1 className="text-4xl sm:text-5xl font-bold text-sky-700 dark:text-sky-500">
          AWS Quiz Challenge
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Test your knowledge on AWS services.</p>
        <button
          onClick={toggleTheme}
          className="absolute top-0 right-0 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <MoonIcon key="moon" className="w-6 h-6" /> : <SunIcon key="sun" className="w-6 h-6" />}
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {quizState === 'not_started' ? (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg text-center">
              <h2 className="text-3xl font-semibold text-sky-600 dark:text-sky-400 mb-4">Welcome to the Quiz!</h2>
              {renderNotStartedContent()}
            </div>
          ) : quizState === 'completed' ? (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg text-center">
              <h2 className="text-3xl font-semibold text-sky-600 dark:text-sky-400 mb-4">Quiz Completed!</h2>
              <p className="text-xl text-slate-700 dark:text-slate-300 mb-6">
                Your score: <span className="font-bold text-emerald-500 dark:text-emerald-400">{score}</span> out of {questions.length}
              </p>
              <button
                onClick={startQuiz}
                className="px-6 py-3 text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-md shadow-sm transition"
              >
                Restart Quiz
              </button>
            </div>
          ) : ( 
            <>
              {isFetchingInitialJson && !currentQuestionData && <div className="w-full min-h-[20rem] md:min-h-[24rem] bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center p-6 text-slate-500 dark:text-slate-400">Loading questions...</div>}
              {(!isFetchingInitialJson || currentQuestionData) && (
                <QuizQuestionDisplay
                  questionData={currentQuestionData}
                  selectedOptionKey={selectedOptionKey}
                  isAnswerSubmitted={isAnswerSubmitted}
                  onOptionSelect={handleOptionSelect}
                  showExplanation={quizState === 'active' && isAnswerSubmitted}
                />
              )}
              {quizState === 'active' && currentQuestionData && (
                <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedOptionKey}
                      className="w-full sm:w-auto px-6 py-3 text-lg font-medium text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-md shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="w-full sm:w-auto px-6 py-3 text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-md shadow-sm transition"
                    >
                      {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                  )}
                </div>
              )}
               {quizState === 'idle' && questions.length > 0 && currentQuestionData && (
                 <div className="mt-4 flex justify-center">
                    <button
                        onClick={startQuiz}
                        className="px-6 py-3 text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-md shadow-sm transition"
                    >
                        Start Quiz from this Question
                    </button>
                 </div>
                )}

              {(quizState === 'idle' && questions.length > 0 && currentQuestionData) && (
                <Controls
                  onPrev={handlePrevQuestion}
                  onNext={() => { 
                    if (currentQuestionIndex < questions.length - 1) {
                      setCurrentQuestionIndex(i => i + 1);
                      setSelectedOptionKey(null);
                      setIsAnswerSubmitted(false); 
                    }
                  }}
                  onShuffle={handleShuffleQuestions}
                  canPrev={currentQuestionIndex > 0}
                  canNext={currentQuestionIndex < questions.length - 1}
                  questionCount={questions.length}
                  isQuizActive={false} 
                  prevButtonText="View Prev"
                  nextButtonText="View Next"
                />
              )}
              {(quizState === 'active' || (quizState === 'idle' && currentQuestionData)) && questions.length > 0 && (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  {quizState === 'active' ? `Question ${currentQuestionIndex + 1} of ${questions.length} | Score: ${score}` : `Viewing Question ${currentQuestionIndex + 1} of ${questions.length}`}
                </p>
              )}
               {quizState === 'idle' && !currentQuestionData && questions.length > 0 && initialJsonLoadAttempted && !isFetchingInitialJson &&(
                <p className="text-center text-slate-500 dark:text-slate-400">Select a question from the list to view it.</p>
               )}
                {quizState === 'idle' && !currentQuestionData && questions.length === 0 && initialJsonLoadAttempted && !isFetchingInitialJson &&(
                <p className="text-center text-slate-500 dark:text-slate-400">No questions available. Add some questions to get started.</p>
               )}
            </>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Quiz Questions</h2>
              <button
                onClick={openAddModal}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-md shadow-sm transition"
              >
                <PlusIcon className="w-4 h-4 mr-1.5" />
                Add Question
              </button>
            </div>
            <QuestionList
              questions={questions}
              onEdit={openEditModal}
              onDelete={handleDeleteQuestion}
              currentQuestionId={quizState !== 'not_started' && quizState !== 'completed' ? currentQuestionData?.id : undefined}
              onSelectQuestion={handleSelectQuestionFromList}
              isLoading={isFetchingInitialJson && !initialJsonLoadAttempted}
            />
          </div>
          <GeminiGenerator onQuestionsGenerated={handleQuestionsGenerated} />
        </div>
      </main>

      <Modal
        isOpen={showQuestionModal}
        onClose={() => {
          setShowQuestionModal(false);
          setEditingQuestion(null);
        }}
        title={editingQuestion ? 'Edit Quiz Question' : 'Add New Quiz Question'}
      >
        <QuestionForm
          onSubmit={editingQuestion ? handleEditQuestion : handleAddQuestion}
          onCancel={() => {
            setShowQuestionModal(false);
            setEditingQuestion(null);
          }}
          initialData={editingQuestion}
        />
      </Modal>
      
      <footer className="text-center mt-12 py-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Quiz powered by React, Tailwind CSS, and Gemini API.
        </p>
      </footer>
    </div>
  );
};

export default App;
