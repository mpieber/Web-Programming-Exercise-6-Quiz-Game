export interface Question {
  category: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: "easy" | "medium" | "hard";
}

export class QuestionManager {
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

  static async loadQuestions(filePath: string): Promise<Question[]> {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(
        `Fetching ${filePath} failed with status: ${response.status}`,
      );
    }

    const questions: Question[] = await response.json();

    return questions;
  }
}
