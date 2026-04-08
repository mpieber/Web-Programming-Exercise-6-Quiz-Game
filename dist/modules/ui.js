export class UIManager {
    showQuestion(question, questionNumber, onAnswer) {
        const questionContainer = this.requireElement("question-container");
        questionContainer.replaceChildren();
        const questionText = this.createElement("div", "question-text", `${questionNumber}. [${question.category}] ${question.question} (Difficulty: ${question.difficulty})`, ["my-2"], "question-container");
        const answerOptions = this.createElement("div", "answer-options", "", ["row"], "question-container");
        question.options.forEach((option) => {
            const optionsContainer = this.createElement("div", "", "", ["col-12", "col-md-6", "col-lg-3", "px-2", "py-2"], "answer-options");
            const optionButton = this.createElement("button", "", option, ["btn", "btn-primary", "w-100", "option-button"], "");
            optionButton.addEventListener("click", () => {
                this.disableOptionButtons();
                onAnswer(option);
            });
            optionsContainer.appendChild(optionButton);
        });
        this.showElement("quiz-container");
    }
    showStartScreen(onStart) {
        this.showElement("player-input");
        this.hideElement("quiz-container");
        this.showPlayerInput(onStart);
    }
    showPlayerInput(onStart) {
        const playerInputContainer = this.requireElement("player-input");
        playerInputContainer.replaceChildren();
        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.placeholder = "Enter your name";
        textInput.id = "player-name";
        textInput.classList.add("form-control");
        playerInputContainer.appendChild(textInput);
        const startButton = this.createElement("button", "start-button", "Start Game", ["btn", "btn-primary", "my-2"], "player-input");
        startButton.addEventListener("click", () => {
            const playerName = textInput.value.trim();
            if (playerName.length === 0) {
                alert("Please enter your name");
                return;
            }
            onStart(playerName);
        });
    }
    showGameSummary(gameSummary) {
        const resultsContainer = this.requireElement("results");
        resultsContainer.replaceChildren();
        this.hideElement("question-container");
        this.createElement("h2", "", `Total Score: ${gameSummary.totalScore} %`, ["my-2", "text-center"], "results");
        this.createElement("h2", "", `Total Points: ${gameSummary.earnedPoints} / ${gameSummary.maxPoints}`, ["my-2", "text-center"], "results");
        gameSummary.categoryResults.forEach((result) => this.createElement("div", "", `${result.category}: ${result.score} % (${result.correctAnswers}/${result.totalQuestions}, ${result.earnedPoints} points)`, ["my-2", "text-center"], "results"));
        gameSummary.answerRecords.forEach((result, index) => {
            const resultText = result.correctAnswer ? "correct" : "incorrect";
            const questionNumber = index + 1;
            this.createElement("div", "", `Question ${questionNumber}: ${resultText}`, ["my-2", "text-center"], "results");
        });
    }
    showAnswerFeedback(isCorrect, correctAnswer, nextButtonLabel, onNext) {
        const questionContainer = this.requireElement("question-container");
        const feedbackMessage = isCorrect
            ? "Correct!"
            : `Incorrect. Correct answer: ${correctAnswer}`;
        this.createElement("div", "answer-feedback", feedbackMessage, [
            "alert",
            isCorrect ? "alert-success" : "alert-danger",
            "mt-3",
            "text-center",
        ], "question-container");
        const nextButton = this.createElement("button", "next-button", nextButtonLabel, ["btn", "btn-secondary", "mt-2"], "question-container");
        nextButton.addEventListener("click", () => {
            const feedbackElement = questionContainer.querySelector("#answer-feedback");
            const nextButtonElement = questionContainer.querySelector("#next-button");
            feedbackElement === null || feedbackElement === void 0 ? void 0 : feedbackElement.remove();
            nextButtonElement === null || nextButtonElement === void 0 ? void 0 : nextButtonElement.remove();
            onNext();
        });
    }
    showRestartButton(onRestart) {
        const restartButton = this.createElement("button", "restart-button", "Restart Game", ["btn", "btn-primary", "my-3"], "results");
        restartButton.addEventListener("click", () => {
            this.requireElement("results").replaceChildren();
            this.showStartScreen(onRestart);
        });
    }
    showLeaderboard(scoreList) {
        const leaderboardList = this.requireElement("leaderboard-list");
        leaderboardList.replaceChildren();
        scoreList.forEach((entry) => this.createElement("div", "", `${entry.playerName}: ${entry.points} points (${entry.score} %)`, ["card", "p-2", "my-2"], "leaderboard-list"));
    }
    showLeaderboardResetButton(onReset) {
        const resetButton = this.requireElement("reset-leaderboard-button");
        resetButton.addEventListener("click", () => onReset());
    }
    disableOptionButtons() {
        const optionsContainer = this.requireElement("answer-options");
        const optionButtons = optionsContainer.querySelectorAll(".option-button");
        optionButtons.forEach((button) => {
            button.disabled = true;
        });
    }
    // <K extends keyof HTMLElementTagNameMap> defines a generic parameter K
    // constrained to the keys of the interface HTMLElementTagNameMap.
    // HTMLElementTagNameMap maps HTML element names (e.g., "button") as keys
    // to the corresponding type interfaces (e.g., HTMLButtonElement) as values.
    // (see https://www.typescriptlang.org/docs/handbook/dom-manipulation.html)
    createElement(elementType, elementId, textContent, classNames, parentElementId) {
        const element = document.createElement(elementType);
        if (elementId) {
            element.id = elementId;
        }
        if (textContent) {
            element.textContent = textContent;
        }
        classNames.forEach((className) => element.classList.add(className));
        if (parentElementId) {
            const parentElement = document.getElementById(parentElementId);
            if (!parentElement) {
                throw new Error(`Parent element with id '${parentElementId}' not found`);
            }
            parentElement.appendChild(element);
        }
        return element;
    }
    showElement(elementId) {
        const nameInputElement = this.requireElement(elementId);
        nameInputElement.classList.remove("d-none");
    }
    hideElement(elementId) {
        const nameInputElement = this.requireElement(elementId);
        nameInputElement.classList.add("d-none");
    }
    requireElement(elementId) {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`Parent element with id '${elementId}' not found`);
        }
        return element;
    }
}
