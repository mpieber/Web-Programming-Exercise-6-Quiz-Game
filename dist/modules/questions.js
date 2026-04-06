export class Question {
    constructor(category, question, options, answer, difficulty) {
        this.category = category;
        this.question = question;
        this.options = options;
        this.answer = answer;
        this.difficulty = difficulty;
    }
    isCorrect(answerOption) {
        return this.answer === answerOption;
    }
}
export class QuizManager {
    constructor(questions) {
        this.originalQuestions = [...questions];
        this.questions = [...questions];
        this.shuffleQuestions();
    }
    // Fisher–Yates shuffling
    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[randomIndex]] = [
                this.questions[randomIndex],
                this.questions[i],
            ];
        }
    }
    getNextQuestion() {
        return this.questions.pop();
    }
    reset() {
        this.questions = this.originalQuestions;
        this.shuffleQuestions();
    }
}
