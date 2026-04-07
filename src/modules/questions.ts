export interface Question {
  category: string;
  question: string;
  options: string[];
  answer: number;
  difficulty: "easy" | "medium" | "hard";
}

export class QuizManager {
  private originalQuestions: Question[];
  private questions: Question[];

  constructor(questions: Question[]) {
    this.originalQuestions = [...questions];
    this.questions = [...questions];
    this.shuffleQuestions();
  }

  // Fisher–Yates shuffling
  private shuffleQuestions(): void {
    for (let i = this.questions.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [this.questions[i], this.questions[randomIndex]] = [
        this.questions[randomIndex],
        this.questions[i],
      ];
    }
  }

  getNextQuestion(): Question | undefined {
    return this.questions.pop();
  }

  reset() {
    this.questions = [...this.originalQuestions];
    this.shuffleQuestions();
  }
}
