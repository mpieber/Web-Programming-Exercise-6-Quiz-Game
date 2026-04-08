export class GameManager {
    constructor(questionManager, scoreManager, uiManager, totalQuestionCount, onRoundEnd) {
        this.questionManager = questionManager;
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
        this.currentQuestion = this.questionManager.getNextQuestion();
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
        const isCorrect = question.answer === playerAnswer;
        this.scoreManager.updateScore(question, playerAnswer);
        const hasMoreQuestions = this.questionCount < this.totalQuestionCount;
        this.uiManager.showAnswerFeedback(isCorrect, question.answer, hasMoreQuestions ? "Next Question" : "Show Results", () => {
            if (hasMoreQuestions) {
                this.currentQuestion = this.questionManager.getNextQuestion();
                if (this.currentQuestion) {
                    this.questionCount++;
                    const nextQuestion = this.currentQuestion;
                    this.uiManager.showQuestion(nextQuestion, this.questionCount, (nextAnswer) => this.handleAnswer(nextQuestion, nextAnswer));
                    return;
                }
                throw new Error("Not enough questions available");
            }
            this.onRoundEnd(this.playerName, this.scoreManager.getEarnedPoints(), this.scoreManager.getScore());
            this.uiManager.showGameSummary(this.scoreManager.getGameSummary());
            this.uiManager.showRestartButton((playerName) => {
                this.resetGame();
                this.setPlayerName(playerName);
                this.startGame();
            });
        });
    }
    resetGame() {
        this.scoreManager.reset();
        this.questionManager.reset();
        this.questionCount = 0;
        this.currentQuestion = undefined;
        this.playerName = "";
    }
}
