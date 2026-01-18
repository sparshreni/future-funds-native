
import QuizData from '../data/quizzes';
import Storage from './storage';
import Gamification from './gamification';

// Quiz Engine Module - Quiz session management and scoring
const QuizEngine = {
    currentQuiz: null,
    currentQuestionIndex: 0,
    answers: [],
    startTime: null,

    // Start a new quiz
    startQuiz(category, difficulty = 'all') {
        // Filter questions by category and difficulty
        let questions = QuizData.questions.filter(q => {
            const categoryMatch = category === 'all' || q.category === category;
            const difficultyMatch = difficulty === 'all' || q.difficulty === difficulty;
            return categoryMatch && difficultyMatch;
        });

        // Shuffle and select questions (max 10 per quiz)
        questions = this.shuffleArray(questions).slice(0, 10);

        this.currentQuiz = {
            category,
            difficulty,
            questions,
            totalQuestions: questions.length
        };
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.startTime = Date.now();

        return this.currentQuiz;
    },

    // Get current question
    getCurrentQuestion() {
        if (!this.currentQuiz) return null;
        return this.currentQuiz.questions[this.currentQuestionIndex];
    },

    // Submit answer for current question
    submitAnswer(selectedAnswer) {
        const question = this.getCurrentQuestion();
        if (!question) return null;

        const isCorrect = selectedAnswer === question.correctAnswer;

        this.answers.push({
            questionId: question.id,
            selectedAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect,
            timestamp: Date.now()
        });

        const result = {
            isCorrect,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            isLastQuestion: this.currentQuestionIndex === this.currentQuiz.questions.length - 1
        };

        return result;
    },

    // Move to next question
    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.currentQuestionIndex++;
            return true;
        }
        return false;
    },

    // Get quiz results
    async getResults() {
        if (!this.currentQuiz) return null;

        const correctCount = this.answers.filter(a => a.isCorrect).length;
        const totalQuestions = this.currentQuiz.questions.length;
        const score = Math.round((correctCount / totalQuestions) * 100);
        const timeSpent = Math.round((Date.now() - this.startTime) / 1000); // in seconds

        const results = {
            category: this.currentQuiz.category,
            difficulty: this.currentQuiz.difficulty,
            totalQuestions,
            correctCount,
            incorrectCount: totalQuestions - correctCount,
            score,
            timeSpent,
            answers: this.answers,
            isPerfect: score === 100
        };

        // Calculate XP reward
        const baseXP = 10;
        const bonusXP = score === 100 ? 20 : 0;
        const speedBonus = timeSpent < 60 ? 10 : 0;
        results.xpEarned = baseXP + bonusXP + speedBonus;

        // Save to history
        await Storage.addQuizResult(results);

        // Check for badges
        const quizHistory = await Storage.getQuizHistory();

        if (quizHistory.length === 1) {
            await Gamification.checkAndAwardBadge('first_quiz');
        }

        if (results.isPerfect) {
            await Gamification.checkAndAwardBadge('perfect_score');
        }

        if (quizHistory.length >= 10) {
            await Gamification.checkAndAwardBadge('money_master');
        }

        // Award XP
        const xpResult = await Gamification.awardXP(results.xpEarned);
        results.levelUp = xpResult.leveledUp;
        results.newLevel = xpResult.newLevel;

        return results;
    },

    // Get progress (for progress bar)
    getProgress() {
        if (!this.currentQuiz) return 0;
        return ((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100;
    },

    // Shuffle array (Fisher-Yates algorithm)
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // Reset quiz
    reset() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.startTime = null;
    },

    // Get statistics for a category
    async getCategoryStats(category) {
        const history = await Storage.getQuizHistory();
        const categoryQuizzes = history.filter(q => q.category === category);

        if (categoryQuizzes.length === 0) {
            return {
                totalQuizzes: 0,
                averageScore: 0,
                bestScore: 0,
                totalQuestions: 0,
                correctAnswers: 0
            };
        }

        const totalQuizzes = categoryQuizzes.length;
        const averageScore = Math.round(
            categoryQuizzes.reduce((sum, q) => sum + q.score, 0) / totalQuizzes
        );
        const bestScore = Math.max(...categoryQuizzes.map(q => q.score));
        const totalQuestions = categoryQuizzes.reduce((sum, q) => sum + q.totalQuestions, 0);
        const correctAnswers = categoryQuizzes.reduce((sum, q) => sum + q.correctCount, 0);

        return {
            totalQuizzes,
            averageScore,
            bestScore,
            totalQuestions,
            correctAnswers,
            accuracy: Math.round((correctAnswers / totalQuestions) * 100)
        };
    }
};

export default QuizEngine;
