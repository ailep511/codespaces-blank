// Import all question files
import questions01 from "./questions_01.json"
import questions02 from "./questions_02.json"
import questions03 from "./questions_03.json"
import questions04 from "./questions_04.json"
import questions04 from "./questions_05.json"

// Export all question files as an array
// export const questionFiles = [questions01, questions02, questions03, questions04]
export const questionFiles = [questions04, questions05]

// Function to get a random question file
export function getRandomQuestionFile() {
  const randomIndex = Math.floor(Math.random() * questionFiles.length)
  return questionFiles[randomIndex]
}
