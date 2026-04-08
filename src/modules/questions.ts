export interface Question {
  idx: number;
  category: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: "easy" | "medium" | "hard";
}

interface RawQuestion {
  category: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: "easy" | "medium" | "hard";
}

export class QuestionManager {
  private questionsByIdx: Question[];
  private questionIdxQueue: number[];

  constructor(questions: Question[]) {
    this.questionsByIdx = [...questions];
    this.questionIdxQueue = questions.map((question) => question.idx);
    this.shuffleQuestionIndices();
  }

  // Fisher-Yates shuffling on JSON indices so questions are retrieved by idx.
  private shuffleQuestionIndices(): void {
    for (let i = this.questionIdxQueue.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [this.questionIdxQueue[i], this.questionIdxQueue[randomIndex]] = [
        this.questionIdxQueue[randomIndex],
        this.questionIdxQueue[i],
      ];
    }
  }

  getNextQuestion(): Question | undefined {
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

  static async loadQuestions(filePath: string): Promise<Question[]> {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(
        `Fetching ${filePath} failed with status: ${response.status}`,
      );
    }

    const questions: RawQuestion[] = await response.json();

    return questions.map((question, idx) => ({
      idx,
      ...question,
    }));
  }
}
