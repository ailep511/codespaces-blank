// Import all question files
// import questions01 from "./questions_01.json"
// import questions02 from "./questions_02.json"
// import questions03 from "./questions_03.json"
// import questions04 from "./questions_04.json"
// import questions05 from "./questions_05.json"
// import questions06 from "./questions_06.json"
// import questions07 from "./questions_07.json"
// import questions08 from "./questions_08.json"
import questions09 from "./questions_09.json"
import questions10 from "./questions_10.json"
import questions11 from "./questions_11.json"
import questions12 from "./questions_12.json"
import questions13 from "./questions_13.json"
import questions14 from "./questions_14.json"
import questions15 from "./questions_15.json"
import questions16 from "./questions_16.json"



// Export all question files as an array
export const questionFiles = [
  // questions01,
  // questions02,
  // questions03,
  // questions04,
  // questions05, 
  // questions06,
  // questions07,
  // questions08,
  questions09,
  questions10,
  questions11,
  questions12,
  questions13,
  questions14,
  questions15,
  questions16,
]

// Function to get a random question file
export function getRandomQuestionFile() {
  const randomIndex = Math.floor(Math.random() * questionFiles.length)
  return questionFiles[randomIndex]
}
