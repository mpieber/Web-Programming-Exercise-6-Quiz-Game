import { UIManager } from "./modules/ui.js";
import { ScoreManager } from "./modules/scoring.js";
import { QuestionManager } from "./modules/questions.js";
import { GameManager } from "./modules/game.js";
const questionsFilePath = "./questions.json";
const totalQuestionCount = 5;
const scoreList = [];
const uiManager = new UIManager();
initGame(questionsFilePath);
async function initGame(filePath) {
    try {
        const questions = await QuestionManager.loadQuestions(filePath);
        const questionManager = new QuestionManager(questions);
        const scoreManager = new ScoreManager();
        const gameManager = new GameManager(questionManager, scoreManager, uiManager, totalQuestionCount, updateLeaderboard);
        uiManager.showStartScreen((playerName) => {
            gameManager.setPlayerName(playerName);
            gameManager.startGame();
        });
    }
    catch (error) {
        console.error(error);
        alert("Failed to load questions");
    }
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
