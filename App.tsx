"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type { QuizQuestionData } from "./types"
import useLocalStorage from "./hooks/useLocalStorage"
import QuizQuestionDisplay from "./components/QuizQuestionDisplay"
import Controls from "./components/Controls"
import QuestionList from "./components/QuestionList"
import QuestionForm from "./components/QuestionForm"
import Modal from "./components/Modal"
import { PlusIcon, SunIcon, MoonIcon } from "./components/icons"
import { getRandomQuestionFile } from "./questions/index"

type QuizState = "not_started" | "idle" | "active" | "completed"
type Theme = "light" | "dark"
type QuizResult = {
  date: string
  score: number
  total: number
  percentage: number
}

const App: React.FC = () => {
  const [questions, setQuestions] = useLocalStorage<QuizQuestionData[]>("quizQuestions", [])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptionKeys, setSelectedOptionKeys] = useState<string[]>([])
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [quizState, setQuizState] = useState<QuizState>("not_started")

  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestionData | null>(null)

  const [theme, setTheme] = useLocalStorage<Theme>("theme", "light")
  const [quizResults, setQuizResults] = useLocalStorage<QuizResult[]>("quizResults", [])

  const [isFetchingInitialJson, setIsFetchingInitialJson] = useState(false)
  const [initialJsonLoadAttempted, setInitialJsonLoadAttempted] = useState(false)

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  useEffect(() => {
    if (!initialJsonLoadAttempted && questions.length === 0) {
      const loadInitialData = () => {
        setIsFetchingInitialJson(true)
        try {
          const selectedFile = getRandomQuestionFile()
          console.log("[v0] Randomly selected a question file with", selectedFile.length, "questions")

          if (
            Array.isArray(selectedFile) &&
            selectedFile.every(
              (q) =>
                q &&
                typeof q.question === "string" &&
                typeof q.options === "object" &&
                Object.keys(q.options).length > 0 &&
                (typeof q.correctAnswer === "string" ||
                  (Array.isArray(q.correctAnswer) && q.correctAnswer.every((a: any) => typeof a === "string"))) &&
                typeof q.explanation === "string",
            )
          ) {
            const formattedQuestions: QuizQuestionData[] = selectedFile.map((q: any, index: number) => {
              let correctAnswerKey: string | string[]
              if (typeof q.correctAnswer === "string") {
                if (q.correctAnswer.startsWith("[") && q.correctAnswer.endsWith("]")) {
                  correctAnswerKey = q.correctAnswer
                    .slice(1, -1)
                    .split(",")
                    .map((s: string) => s.trim())
                } else {
                  correctAnswerKey = q.correctAnswer
                }
              } else {
                correctAnswerKey = q.correctAnswer
              }

              return {
                id: `file-q-${Date.now()}-${index}`,
                question: q.question,
                options: q.options,
                correctAnswerKey,
                explanation: q.explanation,
              }
            })
            setQuestions(formattedQuestions)
            console.log(`[v0] Successfully loaded ${formattedQuestions.length} questions`)
          } else {
            console.error("[v0] Invalid data structure in selected questions file")
          }
        } catch (error) {
          console.error("[v0] Failed to load questions:", error)
        } finally {
          setIsFetchingInitialJson(false)
          setInitialJsonLoadAttempted(true)
        }
      }
      loadInitialData()
    } else if (!initialJsonLoadAttempted && questions.length > 0) {
      setInitialJsonLoadAttempted(true)
      setIsFetchingInitialJson(false)
    }
  }, [questions.length, setQuestions, initialJsonLoadAttempted])

  useEffect(() => {
    if (quizState === "active") {
      setSelectedOptionKeys([])
      setIsAnswerSubmitted(false)
    }
  }, [currentQuestionIndex, quizState])

  useEffect(() => {
    if (initialJsonLoadAttempted || questions.length > 0) {
      if (quizState !== "not_started" && questions.length === 0) {
        setQuizState("not_started")
        setCurrentQuestionIndex(0)
      } else if (currentQuestionIndex >= questions.length && questions.length > 0) {
        setCurrentQuestionIndex(questions.length - 1)
      } else if (currentQuestionIndex < 0 && questions.length > 0) {
        setCurrentQuestionIndex(0)
      }
    }
  }, [questions, currentQuestionIndex, quizState, initialJsonLoadAttempted])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  const currentQuestionData = questions.length > 0 ? questions[currentQuestionIndex] : null

  const startQuiz = useCallback(() => {
    if (questions.length === 0) {
      if (quizState !== "not_started") {
        alert("No questions available to start the quiz. Please add some questions first.")
      }
      return
    }

    if (quizState === "not_started" || quizState === "completed") {
      setCurrentQuestionIndex(0)
    }

    setScore(0)
    setSelectedOptionKeys([])
    setIsAnswerSubmitted(false)
    setQuizState("active")
  }, [questions.length, quizState])

  const handleNewQuiz = useCallback(() => {
    try {
      const selectedFile = getRandomQuestionFile()
      console.log("[v0] Loading new quiz with", selectedFile.length, "questions")

      if (
        Array.isArray(selectedFile) &&
        selectedFile.every(
          (q) =>
            q &&
            typeof q.question === "string" &&
            typeof q.options === "object" &&
            Object.keys(q.options).length > 0 &&
            (typeof q.correctAnswer === "string" ||
              (Array.isArray(q.correctAnswer) && q.correctAnswer.every((a: any) => typeof a === "string"))) &&
            typeof q.explanation === "string",
        )
      ) {
        const formattedQuestions: QuizQuestionData[] = selectedFile.map((q: any, index: number) => {
          let correctAnswerKey: string | string[]
          if (typeof q.correctAnswer === "string") {
            if (q.correctAnswer.startsWith("[") && q.correctAnswer.endsWith("]")) {
              correctAnswerKey = q.correctAnswer
                .slice(1, -1)
                .split(",")
                .map((s: string) => s.trim())
            } else {
              correctAnswerKey = q.correctAnswer
            }
          } else {
            correctAnswerKey = q.correctAnswer
          }

          return {
            id: `file-q-${Date.now()}-${index}`,
            question: q.question,
            options: q.options,
            correctAnswerKey,
            explanation: q.explanation,
          }
        })
        setQuestions(formattedQuestions)
        setCurrentQuestionIndex(0)
        setScore(0)
        setSelectedOptionKeys([])
        setIsAnswerSubmitted(false)
        setQuizState("active")
        console.log(`[v0] Successfully loaded ${formattedQuestions.length} new questions and started quiz`)
      } else {
        console.error("[v0] Invalid data structure in selected questions file")
        alert("Failed to load new questions. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Failed to load new questions:", error)
      alert("Failed to load new questions. Please try again.")
    }
  }, [setQuestions])

  const handleOptionSelect = useCallback(
    (optionKey: string) => {
      if (!isAnswerSubmitted && quizState === "active" && currentQuestionData) {
        setSelectedOptionKeys((prev) => {
          if (prev.includes(optionKey)) {
            // If already selected, deselect it
            return prev.filter((k) => k !== optionKey)
          } else {
            // Add the option to selections
            return [...prev, optionKey]
          }
        })
      }
    },
    [isAnswerSubmitted, quizState, currentQuestionData],
  )

  const handleSubmitAnswer = useCallback(() => {
    if (selectedOptionKeys.length === 0 || quizState !== "active" || !currentQuestionData) return

    setIsAnswerSubmitted(true)

    const correctAnswer = currentQuestionData.correctAnswerKey
    let isCorrect = false

    if (Array.isArray(correctAnswer)) {
      const sortedSelected = [...selectedOptionKeys].sort()
      const sortedCorrect = [...correctAnswer].sort()
      isCorrect =
        sortedSelected.length === sortedCorrect.length &&
        sortedSelected.every((key, index) => key === sortedCorrect[index])
    } else {
      isCorrect = selectedOptionKeys.length === 1 && selectedOptionKeys[0] === correctAnswer
    }

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1)
    }
  }, [selectedOptionKeys, quizState, currentQuestionData])

  const handleNextQuestion = useCallback(() => {
    if (quizState !== "active" || !currentQuestionData) return

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    } else {
      const finalScore = score
      const percentage = Math.round((finalScore / questions.length) * 100)
      const newResult: QuizResult = {
        date: new Date().toLocaleString(),
        score: finalScore,
        total: questions.length,
        percentage,
      }
      setQuizResults((prev) => [newResult, ...prev].slice(0, 5))
      setQuizState("completed")
    }
  }, [quizState, currentQuestionIndex, questions.length, currentQuestionData, score, setQuizResults])

  const handlePrevQuestion = useCallback(() => {
    if (quizState === "idle" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
      setSelectedOptionKeys([])
      setIsAnswerSubmitted(false)
    }
  }, [quizState, currentQuestionIndex])

  const handleShuffleQuestions = useCallback(() => {
    if (questions.length > 1 && quizState !== "active") {
      const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5)
      setQuestions(shuffledQuestions)
      setCurrentQuestionIndex(0)
      setSelectedOptionKeys([])
      setIsAnswerSubmitted(false)
      if (quizState !== "not_started") {
        setQuizState("idle")
      }
    }
  }, [questions, setQuestions, quizState])

  const handleAddQuestion = (newQuestionData: Omit<QuizQuestionData, "id">) => {
    const newQuestion: QuizQuestionData = {
      ...newQuestionData,
      id: `question-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    }
    const newQuestions = [...questions, newQuestion]
    setQuestions(newQuestions)

    if (quizState === "not_started" || quizState === "idle") {
      setCurrentQuestionIndex(newQuestions.length - 1)
      setQuizState("idle")
    }
    setShowQuestionModal(false)
  }

  const handleEditQuestion = (updatedQuestionData: Omit<QuizQuestionData, "id">) => {
    if (editingQuestion) {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q.id === editingQuestion.id ? { ...q, ...updatedQuestionData, id: q.id } : q)),
      )
      setEditingQuestion(null)
      setShowQuestionModal(false)
    }
  }

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      const oldLength = questions.length
      const deletedQuestionOriginalIndex = questions.findIndex((q) => q.id === id)
      const newQuestions = questions.filter((q) => q.id !== id)
      setQuestions(newQuestions)

      if (quizState === "active") {
        alert("Question deleted. Quiz state might be affected. Consider restarting the quiz if issues arise.")
        if (newQuestions.length === 0) {
          setQuizState("not_started")
          setCurrentQuestionIndex(0)
        } else if (currentQuestionIndex >= newQuestions.length) {
          setCurrentQuestionIndex(Math.max(0, newQuestions.length - 1))
        }
        if (currentQuestionData?.id === id) {
          setSelectedOptionKeys([])
          setIsAnswerSubmitted(false)
        }
      } else if (quizState === "idle" || quizState === "not_started") {
        if (newQuestions.length === 0) {
          setQuizState("not_started")
          setCurrentQuestionIndex(0)
        } else if (currentQuestionIndex === deletedQuestionOriginalIndex && currentQuestionIndex >= oldLength - 1) {
          setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
        } else if (deletedQuestionOriginalIndex < currentQuestionIndex) {
          setCurrentQuestionIndex((prev) => prev - 1)
        } else if (currentQuestionIndex >= newQuestions.length) {
          setCurrentQuestionIndex(Math.max(0, newQuestions.length - 1))
        }
        if (quizState === "idle" && newQuestions.length === 0) setQuizState("not_started")
        else if (
          quizState === "not_started" &&
          newQuestions.length > 0 &&
          (initialJsonLoadAttempted || questions.length > 0)
        )
          setQuizState("idle")
        else if (quizState === "idle" && newQuestions.length > 0 && currentQuestionIndex >= newQuestions.length) {
          setCurrentQuestionIndex(newQuestions.length - 1)
        } else if (quizState === "idle" && newQuestions.length > 0 && currentQuestionIndex < 0) {
          setCurrentQuestionIndex(0)
        }
      }
    }
  }

  const openAddModal = () => {
    setEditingQuestion(null)
    setShowQuestionModal(true)
  }

  const openEditModal = (question: QuizQuestionData) => {
    setEditingQuestion(question)
    setShowQuestionModal(true)
  }

  const handleSelectQuestionFromList = (index: number) => {
    if (
      quizState === "active" &&
      !window.confirm("Selecting a question will end the current quiz and display the selected question. Continue?")
    ) {
      return
    }
    setCurrentQuestionIndex(index)
    setSelectedOptionKeys([])
    setIsAnswerSubmitted(false)
    setQuizState("idle")
  }

  const handleGoToHomepage = useCallback(() => {
    setQuizState("not_started")
    setCurrentQuestionIndex(0)
    setSelectedOptionKeys([])
    setIsAnswerSubmitted(false)
    setScore(0)
  }, [])

  const renderNotStartedContent = () => {
    if (isFetchingInitialJson) {
      return <p className="text-xl text-slate-700 dark:text-slate-300 mb-6">Loading initial questions...</p>
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

          {quizResults.length > 0 && (
            <div className="mt-8 w-full max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">Latest Results</h3>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-2">
                {quizResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600 last:border-b-0"
                  >
                    <span className="text-sm text-slate-600 dark:text-slate-400">{result.date}</span>
                    <span
                      className={`font-semibold ${
                        result.percentage >= 70
                          ? "text-emerald-600 dark:text-emerald-400"
                          : result.percentage >= 50
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {result.score}/{result.total} ({result.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )
    }
    if (initialJsonLoadAttempted || !isFetchingInitialJson) {
      return (
        <>
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-6">There are no questions in the quiz yet.</p>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            {initialJsonLoadAttempted && questions.length === 0 && !isFetchingInitialJson
              ? "Failed to load initial questions or questions.json is empty. "
              : ""}
            Please add some questions using the panel on the right to begin.
          </p>
        </>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <header className="text-center mb-10 relative">
        <h1 className="text-4xl sm:text-5xl font-bold text-sky-700 dark:text-sky-500">AWS SAA-C03 Quiz</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Test your knowledge on AWS services.</p>
        <button
          onClick={toggleTheme}
          className="absolute top-0 right-0 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <MoonIcon key="moon" className="w-6 h-6" /> : <SunIcon key="sun" className="w-6 h-6" />}
        </button>
      </header>

      <main
        className={`max-w-6xl mx-auto ${quizState === "idle" || quizState === "completed" ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : ""}`}
      >
        <div className={quizState === "idle" || quizState === "completed" ? "lg:col-span-2 space-y-6" : "space-y-6"}>
          {quizState === "not_started" ? (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg text-center">
              <h2 className="text-3xl font-semibold text-sky-600 dark:text-sky-400 mb-4">Welcome to the Quiz!</h2>
              {renderNotStartedContent()}
            </div>
          ) : quizState === "completed" ? (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg text-center">
              <h2 className="text-3xl font-semibold text-sky-600 dark:text-sky-400 mb-6">Quiz Completed!</h2>

              <div className="mb-8 space-y-4">
                <div className="text-5xl font-bold text-sky-600 dark:text-sky-400">
                  {Math.round((score / questions.length) * 100)}%
                </div>
                <p className="text-xl text-slate-700 dark:text-slate-300">
                  You scored <span className="font-bold text-emerald-500 dark:text-emerald-400">{score}</span> out of{" "}
                  <span className="font-bold">{questions.length}</span>
                </p>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    {Math.round((score / questions.length) * 100) >= 80
                      ? "Excellent work! 🎉"
                      : Math.round((score / questions.length) * 100) >= 60
                        ? "Good job! Keep practicing! 👍"
                        : "Keep studying and try again! 💪"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleGoToHomepage}
                  className="w-full sm:w-auto px-6 py-3 text-lg font-medium text-slate-700 dark:text-slate-200 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md shadow-sm transition"
                >
                  Go to Homepage
                </button>
                <button
                  onClick={handleNewQuiz}
                  className="w-full sm:w-auto px-6 py-3 text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-md shadow-sm transition"
                >
                  New Quiz
                </button>
              </div>
            </div>
          ) : (
            <>
              {isFetchingInitialJson && !currentQuestionData && (
                <div className="w-full min-h-[20rem] md:min-h-[24rem] bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center p-6 text-slate-500 dark:text-slate-400">
                  Loading questions...
                </div>
              )}
              {(!isFetchingInitialJson || currentQuestionData) && (
                <QuizQuestionDisplay
                  questionData={currentQuestionData}
                  selectedOptionKeys={selectedOptionKeys}
                  isAnswerSubmitted={isAnswerSubmitted}
                  onOptionSelect={handleOptionSelect}
                  showExplanation={quizState === "active" && isAnswerSubmitted}
                />
              )}
              {quizState === "active" && currentQuestionData && (
                <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={
                        !currentQuestionData ||
                        selectedOptionKeys.length !== Object.keys(currentQuestionData.options).length
                      }
                      className="w-full sm:w-auto px-6 py-3 text-lg font-medium text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-md shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="w-full sm:w-auto px-6 py-3 text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-md shadow-sm transition"
                    >
                      {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                    </button>
                  )}
                </div>
              )}
              {quizState === "idle" && questions.length > 0 && currentQuestionData && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={startQuiz}
                    className="px-6 py-3 text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-md shadow-sm transition"
                  >
                    Start Quiz from this Question
                  </button>
                </div>
              )}

              {quizState === "idle" && questions.length > 0 && currentQuestionData && (
                <Controls
                  onPrev={handlePrevQuestion}
                  onNext={() => {
                    if (currentQuestionIndex < questions.length - 1) {
                      setCurrentQuestionIndex((i) => i + 1)
                      setSelectedOptionKeys([])
                      setIsAnswerSubmitted(false)
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
              {(quizState === "active" || (quizState === "idle" && currentQuestionData)) && questions.length > 0 && (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  {quizState === "active"
                    ? `Question ${currentQuestionIndex + 1} of ${questions.length} | Score: ${score}`
                    : `Viewing Question ${currentQuestionIndex + 1} of ${questions.length}`}
                </p>
              )}
              {quizState === "idle" &&
                !currentQuestionData &&
                questions.length > 0 &&
                initialJsonLoadAttempted &&
                !isFetchingInitialJson && (
                  <p className="text-center text-slate-500 dark:text-slate-400">
                    Select a question from the list to view it.
                  </p>
                )}
              {quizState === "idle" &&
                !currentQuestionData &&
                questions.length === 0 &&
                initialJsonLoadAttempted &&
                !isFetchingInitialJson && (
                  <p className="text-center text-slate-500 dark:text-slate-400">
                    No questions available. Add some questions to get started.
                  </p>
                )}
            </>
          )}
        </div>

        {(quizState === "idle" || quizState === "completed") && (
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
                currentQuestionId={
                  quizState !== "not_started" && quizState !== "completed" ? currentQuestionData?.id : undefined
                }
                onSelectQuestion={handleSelectQuestionFromList}
                isLoading={isFetchingInitialJson && !initialJsonLoadAttempted}
              />
            </div>
          </div>
        )}
      </main>

      <Modal
        isOpen={showQuestionModal}
        onClose={() => {
          setShowQuestionModal(false)
          setEditingQuestion(null)
        }}
        title={editingQuestion ? "Edit Quiz Question" : "Add New Quiz Question"}
      >
        <QuestionForm
          onSubmit={editingQuestion ? handleEditQuestion : handleAddQuestion}
          onCancel={() => {
            setShowQuestionModal(false)
            setEditingQuestion(null)
          }}
          initialData={editingQuestion}
        />
      </Modal>

      <footer className="text-center mt-12 py-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">Quiz powered by React and Tailwind CSS.</p>
      </footer>
    </div>
  )
}

export default App
