export class GameManager {
    constructor(quizManager, scoreManager, uiManager, totalQuestionCount, onRoundEnd) {
        this.quizManager = quizManager;
        this.scoreManager = scoreManager;
        this.uiManager = uiManager;
        this.totalQuestionCount = totalQuestionCount;
        this.onRoundEnd = onRoundEnd;
        this.questionCount = 0;
        this.currentQuestion = undefined;
        this.playerName = "";
    }
    setPlayerName(playerName) {
        this.playerName = playerName;
    }
    startGame() {
        this.uiManager.hideElement("player-input");
        this.uiManager.showElement("quiz-container");
        this.uiManager.showElement("question-container");
        this.currentQuestion = this.quizManager.getNextQuestion();
        if (this.currentQuestion) {
            this.questionCount++;
            const question = this.currentQuestion;
            this.uiManager.showQuestion(question, this.questionCount, (playerAnswer) => this.handleAnswer(question, playerAnswer));
        }
        else {
            throw new Error("Not enough questions available");
        }
    }
    handleAnswer(question, playerAnswer) {
        this.scoreManager.updateScore(question, playerAnswer);
        if (this.questionCount < this.totalQuestionCount) {
            this.currentQuestion = this.quizManager.getNextQuestion();
        }
        else {
            this.onRoundEnd(this.playerName, this.scoreManager.getEarnedPoints(), this.scoreManager.getScore());
            this.uiManager.showGameSummary(this.scoreManager.getGameSummary());
            this.uiManager.showRestartButton((playerName) => {
                this.resetGame();
                this.setPlayerName(playerName);
                this.startGame();
            });
            return;
        }
        if (this.currentQuestion) {
            this.questionCount++;
            const question = this.currentQuestion;
            this.uiManager.showQuestion(question, this.questionCount, (optionIndex) => this.handleAnswer(question, optionIndex));
        }
        else {
            throw new Error("Not enough questions available");
        }
    }
    resetGame() {
        this.scoreManager.reset();
        this.quizManager.reset();
        this.questionCount = 0;
        this.currentQuestion = undefined;
        this.playerName = "";
    }
}
