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
  private questionsPerRound: number;

  constructor(questions: Question[], questionsPerRound: number) {
    this.questionsByIdx = [...questions];
    this.questionsPerRound = questionsPerRound;
    this.questionIdxQueue = this.buildBalancedQuestionQueue(
      this.questionsPerRound,
    );
  }

  // Fisher-Yates shuffling helper to randomize selected indices.
  private shuffleIndices(indices: number[]): number[] {
    const shuffled = [...indices];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[i],
      ];
    }

    return shuffled;
  }

  private buildBalancedQuestionQueue(totalQuestions: number): number[] {
    const difficulties: Question["difficulty"][] = ["easy", "medium", "hard"];
    const questionsByDifficulty: Record<Question["difficulty"], number[]> = {
      easy: [],
      medium: [],
      hard: [],
    };

    this.questionsByIdx.forEach((question) => {
      questionsByDifficulty[question.difficulty].push(question.idx);
    });

    const basePerDifficulty = Math.floor(totalQuestions / difficulties.length);
    const remainder = totalQuestions % difficulties.length;

    const distribution: Record<Question["difficulty"], number> = {
      easy: basePerDifficulty,
      medium: basePerDifficulty,
      hard: basePerDifficulty,
    };

    const remainderOrder = this.shuffleIndices([0, 1, 2]);
    for (let i = 0; i < remainder; i++) {
      const difficulty = difficulties[remainderOrder[i]];
      distribution[difficulty] += 1;
    }

    const selectedIndices: number[] = [];

    difficulties.forEach((difficulty) => {
      const available = this.shuffleIndices(questionsByDifficulty[difficulty]);
      const requiredCount = distribution[difficulty];

      if (available.length < requiredCount) {
        throw new Error(
          `Not enough ${difficulty} questions. Required ${requiredCount}, available ${available.length}.`,
        );
      }

      selectedIndices.push(...available.slice(0, requiredCount));
    });

    return this.shuffleIndices(selectedIndices);
  }

  getNextQuestion(): Question | undefined {
    const questionIdx = this.questionIdxQueue.pop();

    if (questionIdx === undefined) {
      return undefined;
    }

    return this.questionsByIdx[questionIdx];
  }

  reset(): void {
    this.questionIdxQueue = this.buildBalancedQuestionQueue(
      this.questionsPerRound,
    );
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
