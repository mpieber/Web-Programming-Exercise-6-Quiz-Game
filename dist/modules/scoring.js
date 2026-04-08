export class ScoreManager {
    constructor() {
        this.earnedPoints = 0;
        this.maxPoints = 0;
        this.categoryResults = [];
        this.answerRecords = [];
        this.pointsPerDifficulty = { easy: 1, medium: 2, hard: 3 };
    }
    calculatePercentage(earned, max) {
        if (max === 0) {
            return 0;
        }
        return Math.round((earned / max) * 100 * 100) / 100;
    }
    updateScore(question, playerAnswer) {
        const currPoints = this.pointsPerDifficulty[question.difficulty];
        let categoryResult = this.categoryResults.find((item) => item.category === question.category);
        if (!categoryResult) {
            categoryResult = {
                category: question.category,
                correctAnswers: 0,
                totalQuestions: 0,
                earnedPoints: 0,
                maxPoints: 0,
            };
            this.categoryResults.push(categoryResult);
        }
        this.maxPoints += currPoints;
        categoryResult.maxPoints += currPoints;
        categoryResult.totalQuestions++;
        if (question.answer === playerAnswer) {
            this.earnedPoints += currPoints;
            categoryResult.earnedPoints += currPoints;
            categoryResult.correctAnswers++;
            this.answerRecords.push({ correctAnswer: true });
        }
        else {
            this.answerRecords.push({ correctAnswer: false });
        }
    }
    getGameSummary() {
        this.categoryResults.forEach((result) => (result.score = this.calculatePercentage(result.earnedPoints, result.maxPoints)));
        return {
            totalScore: this.calculatePercentage(this.earnedPoints, this.maxPoints),
            earnedPoints: this.earnedPoints,
            maxPoints: this.maxPoints,
            categoryResults: this.categoryResults,
            answerRecords: this.answerRecords,
        };
    }
    getScore() {
        return this.calculatePercentage(this.earnedPoints, this.maxPoints);
    }
    getEarnedPoints() {
        return this.earnedPoints;
    }
    reset() {
        this.earnedPoints = 0;
        this.maxPoints = 0;
        this.categoryResults = [];
        this.answerRecords = [];
    }
}
