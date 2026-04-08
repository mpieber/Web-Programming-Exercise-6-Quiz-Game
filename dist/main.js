import { UIManager } from "./modules/ui.js";
import { ScoreManager } from "./modules/scoring.js";
import { QuestionManager } from "./modules/questions.js";
import { GameManager } from "./modules/game.js";
const questionsFilePath = "./questions.json";
const totalQuestionCount = 5;
const leaderboardStorageKey = "quizLeaderboard";
const scoreList = loadScoreList();
const uiManager = new UIManager();
uiManager.showLeaderboard(scoreList);
uiManager.showLeaderboardResetButton(resetLeaderboard);
initGame(questionsFilePath);
function loadScoreList() {
    const rawLeaderboard = localStorage.getItem(leaderboardStorageKey);
    if (!rawLeaderboard) {
        return [];
    }
    try {
        const parsedLeaderboard = JSON.parse(rawLeaderboard);
        if (!Array.isArray(parsedLeaderboard)) {
            return [];
        }
        const validRecords = parsedLeaderboard.filter((entry) => typeof (entry === null || entry === void 0 ? void 0 : entry.playerName) === "string" &&
            typeof (entry === null || entry === void 0 ? void 0 : entry.points) === "number" &&
            typeof (entry === null || entry === void 0 ? void 0 : entry.score) === "number");
        return validRecords.sort((a, b) => b.score - a.score);
    }
    catch (error) {
        console.error("Failed to parse leaderboard from localStorage", error);
        return [];
    }
}
function saveScoreList() {
    localStorage.setItem(leaderboardStorageKey, JSON.stringify(scoreList));
}
function resetLeaderboard() {
    scoreList.length = 0;
    saveScoreList();
    uiManager.showLeaderboard(scoreList);
}
async function initGame(filePath) {
    try {
        const questions = await QuestionManager.loadQuestions(filePath);
        const questionManager = new QuestionManager(questions, totalQuestionCount);
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
        if (score > existingPlayer.score) {
            existingPlayer.score = score;
            existingPlayer.points = points;
        }
    }
    else {
        scoreList.push({ playerName: playerName, points: points, score: score });
    }
    scoreList.sort((a, b) => b.score - a.score);
    saveScoreList();
    uiManager.showLeaderboard(scoreList);
}
