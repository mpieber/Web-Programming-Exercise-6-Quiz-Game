import { UIManager } from "./modules/ui.js";
import { ScoreManager } from "./modules/scoring.js";
import { QuizManager } from "./modules/questions.js";
import { GameManager } from "./modules/game.js";
const questionsFilePath = "./questions.json";
const totalQuestionCount = 5;
const scoreList = [];
const uiManager = new UIManager();
initGame(questionsFilePath);
async function initGame(filePath) {
    try {
        const questions = await loadQuestions(filePath);
        const quizManager = new QuizManager(questions);
        const scoreManager = new ScoreManager();
        const gameManager = new GameManager(quizManager, scoreManager, uiManager, totalQuestionCount, updateLeaderboard);
        uiManager.showStartScreen((playerName) => {
            gameManager.setPlayerName(playerName);
            gameManager.startGame();
        });
    }
    catch (error) {
        console.error(error);
        alert("Failed to load questions.");
    }
}
async function loadQuestions(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`Fetching ${filePath} failed with status: ${response.status}`);
    }
    const questions = await response.json();
    return questions;
}
function updateLeaderboard(playerName, points, score) {
    const existingPlayer = scoreList.find((record) => record.playerName === playerName);
    if (existingPlayer) {
        existingPlayer.score = Math.max(existingPlayer.score, score);
    }
    else {
        scoreList.push({ playerName: playerName, points: points, score: score });
    }
    scoreList.sort((a, b) => b.score - a.score);
    uiManager.showLeaderboard(scoreList);
}
