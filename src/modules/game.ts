import { QuestionManager, Question } from "./questions";
import { ScoreManager } from "./scoring";
import { UIManager } from "./ui";

export class GameManager {
  private questionManager: QuestionManager;
  private scoreManager: ScoreManager;
  private uiManager: UIManager;

  private totalQuestionCount: number;
  private questionCount: number;
  private currentQuestion: Question | undefined;

  private playerName: string;

  private onRoundEnd: (
    playerName: string,
    points: number,
    score: number,
  ) => void;

  constructor(
    questionManager: QuestionManager,
    scoreManager: ScoreManager,
    uiManager: UIManager,
    totalQuestionCount: number,
    onRoundEnd: (playerName: string, points: number, score: number) => void,
  ) {
    this.questionManager = questionManager;
    this.scoreManager = scoreManager;
    this.uiManager = uiManager;
    this.totalQuestionCount = totalQuestionCount;
    this.onRoundEnd = onRoundEnd;
    this.questionCount = 0;
    this.currentQuestion = undefined;
    this.playerName = "";
  }

  setPlayerName(playerName: string) {
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
      this.uiManager.showQuestion(
        question,
        this.questionCount,
        (playerAnswer) => this.handleAnswer(question, playerAnswer),
      );
    } else {
      throw new Error("Not enough questions available");
    }
  }

  handleAnswer(question: Question, playerAnswer: string) {
    this.scoreManager.updateScore(question, playerAnswer);

    if (this.questionCount < this.totalQuestionCount) {
      this.currentQuestion = this.questionManager.getNextQuestion();
    } else {
      this.onRoundEnd(
        this.playerName,
        this.scoreManager.getEarnedPoints(),
        this.scoreManager.getScore(),
      );
      this.uiManager.showGameSummary(this.scoreManager.getGameSummary());
      this.uiManager.showRestartButton((playerName: string): void => {
        this.resetGame();
        this.setPlayerName(playerName);
        this.startGame();
      });
      return;
    }

    if (this.currentQuestion) {
      this.questionCount++;
      const question = this.currentQuestion;
      this.uiManager.showQuestion(
        question,
        this.questionCount,
        (playerAnswer) => this.handleAnswer(question, playerAnswer),
      );
    } else {
      throw new Error("Not enough questions available");
    }
  }

  resetGame() {
    this.scoreManager.reset();
    this.questionManager.reset();
    this.questionCount = 0;
    this.currentQuestion = undefined;
    this.playerName = "";
  }
}
