import { UIManager } from "./modules/ui.js";
import { ScoreManager } from "./modules/scoring.js";
import { QuestionManager } from "./modules/questions.js";
import { GameManager } from "./modules/game.js";

export interface ScoreRecord {
  playerName: string;
  points: number;
  score: number;
}

const questionsFilePath = "./questions.json";
const totalQuestionCount = 5;
const leaderboardStorageKey = "quizLeaderboard";

const scoreList: ScoreRecord[] = loadScoreList();

const uiManager = new UIManager();

uiManager.showLeaderboard(scoreList);
uiManager.showLeaderboardResetButton(resetLeaderboard);

initGame(questionsFilePath);

function loadScoreList(): ScoreRecord[] {
  const rawLeaderboard = localStorage.getItem(leaderboardStorageKey);

  if (!rawLeaderboard) {
    return [];
  }

  try {
    const parsedLeaderboard = JSON.parse(rawLeaderboard);

    if (!Array.isArray(parsedLeaderboard)) {
      return [];
    }

    const validRecords = parsedLeaderboard.filter(
      (entry): entry is ScoreRecord =>
        typeof entry?.playerName === "string" &&
        typeof entry?.points === "number" &&
        typeof entry?.score === "number",
    );

    return validRecords.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error("Failed to parse leaderboard from localStorage", error);
    return [];
  }
}

function saveScoreList(): void {
  localStorage.setItem(leaderboardStorageKey, JSON.stringify(scoreList));
}

function resetLeaderboard(): void {
  scoreList.length = 0;
  saveScoreList();
  uiManager.showLeaderboard(scoreList);
}

async function initGame(filePath: string) {
  try {
    const questions = await QuestionManager.loadQuestions(filePath);

    const questionManager = new QuestionManager(questions, totalQuestionCount);
    const scoreManager = new ScoreManager();

    const gameManager = new GameManager(
      questionManager,
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

function updateLeaderboard(
  playerName: string,
  points: number,
  score: number,
): void {
  const existingPlayer = scoreList.find(
    (record) => record.playerName === playerName,
  );

  if (existingPlayer) {
    if (score > existingPlayer.score) {
      existingPlayer.score = score;
      existingPlayer.points = points;
    }
  } else {
    scoreList.push({ playerName: playerName, points: points, score: score });
  }

  scoreList.sort((a, b) => b.score - a.score);
  saveScoreList();

  uiManager.showLeaderboard(scoreList);
}
