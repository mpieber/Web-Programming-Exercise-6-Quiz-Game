import { Question } from "./questions";

export interface CategoryResult {
  category: string;
  correctAnswers: number;
  totalQuestions: number;
  earnedPoints: number;
  maxPoints: number;
  score?: number;
}

export interface AnswerRecord {
  correctAnswer: boolean;
}

export interface GameSummary {
  totalScore: number;
  earnedPoints: number;
  maxPoints: number;
  categoryResults: CategoryResult[];
  answerRecords: AnswerRecord[];
}

export class ScoreManager {
  private earnedPoints: number = 0;
  private maxPoints: number = 0;
  private categoryResults: CategoryResult[] = [];
  private answerRecords: AnswerRecord[] = [];
  private pointsPerDifficulty = { easy: 1, medium: 2, hard: 3 };

  updateScore(question: Question, answerOption: number): void {
    const currPoints = this.pointsPerDifficulty[question.difficulty];

    let categoryResult = this.categoryResults.find(
      (item) => item.category === question.category,
    );

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

    if (question.answer === answerOption) {
      this.earnedPoints += currPoints;
      categoryResult.earnedPoints += currPoints;
      categoryResult.correctAnswers++;
      this.answerRecords.push({ correctAnswer: true });
    } else {
      this.answerRecords.push({ correctAnswer: false });
    }
  }

  getGameSummary(): GameSummary {
    this.categoryResults.forEach(
      (result) =>
        (result.score =
          Math.round((result.earnedPoints / result.maxPoints) * 100 * 100) /
          100),
    );
    return {
      totalScore:
        Math.round((this.earnedPoints / this.maxPoints) * 100 * 100) / 100,
      earnedPoints: this.earnedPoints,
      maxPoints: this.maxPoints,
      categoryResults: this.categoryResults,
      answerRecords: this.answerRecords,
    };
  }

  getScore(): number {
    return Math.round((this.earnedPoints / this.maxPoints) * 100 * 100) / 100;
  }

  getEarnedPoints(): number {
    return this.earnedPoints;
  }

  reset(): void {
    this.earnedPoints = 0;
    this.maxPoints = 0;
    this.categoryResults = [];
    this.answerRecords = [];
  }
}
