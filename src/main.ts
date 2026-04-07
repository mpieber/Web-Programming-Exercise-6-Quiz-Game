import { UIManager } from "./modules/ui.js";
import { ScoreManager } from "./modules/scoring.js";
import { Question, QuizManager } from "./modules/questions.js";
import { GameManager } from "./modules/game.js";

export interface ScoreRecord {
  playerName: string;
  points: number;
  score: number;
}

const questionsFilePath = "./questions.json";
const totalQuestionCount = 5;

const scoreList: ScoreRecord[] = [];

const uiManager = new UIManager();

initGame(questionsFilePath);

async function initGame(filePath: string) {
  try {
    const questions = await loadQuestions(filePath);

    const quizManager = new QuizManager(questions);
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
  } catch (error) {
    console.error(error);
    alert("Failed to load questions");
  }
}

async function loadQuestions(filePath: string): Promise<Question[]> {
  const response = await fetch(filePath);

  if (!response.ok) {
    throw new Error(
      `Fetching ${filePath} failed with status: ${response.status}`,
    );
  }

  const questions: Question[] = await response.json();

  return questions;
}

function updateLeaderboard(
  playerName: string,
  points: number,
  score: number,
): void {
  const existingPlayer = scoreList.find(
    (record) => record.playerName === playerName,
  );

  if (existingPlayer) {
    existingPlayer.score = Math.max(existingPlayer.score, score);
  } else {
    scoreList.push({ playerName: playerName, points: points, score: score });
  }

  scoreList.sort((a, b) => b.score - a.score);

  uiManager.showLeaderboard(scoreList);
}
