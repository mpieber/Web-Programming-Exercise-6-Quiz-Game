export class QuestionManager {
    constructor(questions) {
        this.questionsByIdx = [...questions];
        this.questionIdxQueue = questions.map((question) => question.idx);
        this.shuffleQuestionIndices();
    }
    // Fisher-Yates shuffling on JSON indices so questions are retrieved by idx.
    shuffleQuestionIndices() {
        for (let i = this.questionIdxQueue.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [this.questionIdxQueue[i], this.questionIdxQueue[randomIndex]] = [
                this.questionIdxQueue[randomIndex],
                this.questionIdxQueue[i],
            ];
        }
    }
    getNextQuestion() {
        const questionIdx = this.questionIdxQueue.pop();
        if (questionIdx === undefined) {
            return undefined;
        }
        return this.questionsByIdx[questionIdx];
    }
    reset() {
        this.questionIdxQueue = this.questionsByIdx.map((question) => question.idx);
        this.shuffleQuestionIndices();
    }
    static async loadQuestions(filePath) {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Fetching ${filePath} failed with status: ${response.status}`);
        }
        const questions = await response.json();
        return questions.map((question, idx) => ({
            idx,
            ...question,
        }));
    }
}
