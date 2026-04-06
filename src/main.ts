import { UIManager } from "./modules/ui.js";
import { ScoreManager } from "./modules/scoring.js";
import { Question, QuizManager } from "./modules/questions.js";
import { GameManager } from "./modules/game.js";

const questions: Question[] = [
  new Question(
    "Science",
    "What planet is known as the Red Planet?",
    ["Earth", "Mars", "Jupiter", "Venus"],
    1,
    "easy",
  ),
  new Question(
    "History",
    "Who was the first President of the United States?",
    ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"],
    1,
    "easy",
  ),
  new Question(
    "Geography",
    "What is the capital of France?",
    ["Berlin", "Madrid", "Paris", "Rome"],
    2,
    "easy",
  ),
  new Question("Math", "What is 12 × 8?", ["96", "88", "108", "86"], 0, "easy"),
  new Question(
    "Technology",
    "What does HTML stand for?",
    [
      "Hyper Trainer Marking Language",
      "HyperText Markup Language",
      "HighText Markdown Language",
      "HyperText Machine Language",
    ],
    1,
    "medium",
  ),
  new Question(
    "Literature",
    "Who wrote 'Romeo and Juliet'?",
    ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"],
    2,
    "medium",
  ),
  new Question(
    "Sports",
    "How many players are on the field for one soccer team during a match?",
    ["9", "10", "11", "12"],
    2,
    "medium",
  ),
  new Question(
    "Physics",
    "What is the chemical symbol for gold?",
    ["Ag", "Au", "Gd", "Go"],
    1,
    "medium",
  ),
  new Question(
    "Computer Science",
    "Which data structure uses FIFO (First In, First Out)?",
    ["Stack", "Queue", "Tree", "Graph"],
    1,
    "hard",
  ),
  new Question(
    "Biology",
    "What part of the cell contains genetic material?",
    ["Nucleus", "Membrane", "Ribosome", "Cytoplasm"],
    0,
    "hard",
  ),
];

export interface ScoreRecord {
  playerName: string;
  points: number;
  score: number;
}

const totalQuestionCount = 5;

const scoreList: ScoreRecord[] = [];

const quizManager = new QuizManager(questions);
const uiManager = new UIManager();
const scoreManager = new ScoreManager();

const gameManager = new GameManager(
  quizManager,
  scoreManager,
  uiManager,
  totalQuestionCount,
  updateLeaderboard,
);

uiManager.showStartScreen((playerName: string): void => {
  gameManager.setPlayerName(playerName);
  gameManager.startGame();
});

function updateLeaderboard(
  playerName: string,
  points: number,
  score: number,
): void {
  const existingPlayer = scoreList.find(
    (record) => record.playerName.toLowerCase() === playerName.toLowerCase(),
  );

  if (existingPlayer) {
    existingPlayer.score = Math.max(existingPlayer.score, score);
  } else {
    scoreList.push({ playerName: playerName, points: points, score: score });
  }

  scoreList.sort((a, b) => b.score - a.score);

  uiManager.showLeaderboard(scoreList);
}
