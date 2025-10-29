export interface QuizQuestionData {
  id: string
  question: string
  options: { [key: string]: string } // e.g., { "A": "Option A", "B": "Option B" }
  correctAnswerKey: string | string[] // e.g., "A" or ["A", "C"]
  explanation: string
}
