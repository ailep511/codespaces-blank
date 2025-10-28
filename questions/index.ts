// Import all question files
import questions01 from "./questions_01.json"
import questions02 from "./questions_02.json"
import questions03 from "./questions_03.json"

// Export all question files as an array
export const questionFiles = [questions01, questions02, questions03]

// Function to get a random question file
export function getRandomQuestionFile() {
  const randomIndex = Math.floor(Math.random() * questionFiles.length)
  return questionFiles[randomIndex]
}
