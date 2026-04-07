import { UIManager } from "./modules/ui.js";
import { ScoreManager } from "./modules/scoring.js";
import { QuizManager } from "./modules/questions.js";
import { GameManager } from "./modules/game.js";
const questions = [
    {
        category: "Science",
        question: "What planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        answer: 1,
        difficulty: "easy",
    },
    {
        category: "History",
        question: "Who was the first President of the United States?",
        options: [
            "Abraham Lincoln",
            "George Washington",
            "Thomas Jefferson",
            "John Adams",
        ],
        answer: 1,
        difficulty: "easy",
    },
    {
        category: "Geography",
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: 2,
        difficulty: "easy",
    },
    {
        category: "Math",
        question: "What is 12 × 8?",
        options: ["96", "88", "108", "86"],
        answer: 0,
        difficulty: "easy",
    },
    {
        category: "Technology",
        question: "What does HTML stand for?",
        options: [
            "Hyper Trainer Marking Language",
            "HyperText Markup Language",
            "HighText Markdown Language",
            "HyperText Machine Language",
        ],
        answer: 1,
        difficulty: "medium",
    },
    {
        category: "Literature",
        question: "Who wrote 'Romeo and Juliet'?",
        options: [
            "Charles Dickens",
            "Jane Austen",
            "William Shakespeare",
            "Mark Twain",
        ],
        answer: 2,
        difficulty: "medium",
    },
    {
        category: "Sports",
        question: "How many players are on the field for one soccer team during a match?",
        options: ["9", "10", "11", "12"],
        answer: 2,
        difficulty: "medium",
    },
    {
        category: "Physics",
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Au", "Gd", "Go"],
        answer: 1,
        difficulty: "medium",
    },
    {
        category: "Computer Science",
        question: "Which data structure uses FIFO (First In, First Out)?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        answer: 1,
        difficulty: "hard",
    },
    {
        category: "Biology",
        question: "What part of the cell contains genetic material?",
        options: ["Nucleus", "Membrane", "Ribosome", "Cytoplasm"],
        answer: 0,
        difficulty: "hard",
    },
];
const totalQuestionCount = 5;
const scoreList = [];
const quizManager = new QuizManager(questions);
const uiManager = new UIManager();
const scoreManager = new ScoreManager();
const gameManager = new GameManager(quizManager, scoreManager, uiManager, totalQuestionCount, updateLeaderboard);
uiManager.showStartScreen((playerName) => {
    gameManager.setPlayerName(playerName);
    gameManager.startGame();
});
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
