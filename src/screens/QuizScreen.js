
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import QuizEngine from '../utils/quizEngine';
import QuizData from '../data/quizzes';
import { useUser } from '../context/UserContext';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react-native';

const QuizScreen = ({ navigation }) => {
    const { refreshProfile } = useUser();
    const [viewState, setViewState] = useState('menu'); // 'menu', 'playing', 'result'
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerResult, setAnswerResult] = useState(null);
    const [quizResults, setQuizResults] = useState(null);
    const [progress, setProgress] = useState(0);

    // MENU VIEW
    const renderMenu = () => (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.pageTitle}>Learn & Earn 🧠</Text>
            <Text style={styles.subtitle}>Select a category to start a quiz</Text>

            <View style={styles.categoryGrid}>
                {QuizData.categories.map(cat => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.categoryCard, { borderColor: cat.color }]}
                        onPress={() => startQuiz(cat.id)}
                    >
                        <Text style={styles.catIcon}>{cat.icon}</Text>
                        <Text style={[styles.catName, { color: cat.color }]}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );

    const startQuiz = (categoryId) => {
        QuizEngine.startQuiz(categoryId);
        loadQuestion();
        setViewState('playing');
    };

    const loadQuestion = () => {
        const question = QuizEngine.getCurrentQuestion();
        setCurrentQuestion(question);
        setSelectedAnswer(null);
        setAnswerResult(null);
        setProgress(QuizEngine.getProgress());
    };

    const handleAnswerFn = (index) => {
        if (answerResult) return; // already answered
        setSelectedAnswer(index);
    };

    const submitAnswerFn = () => {
        if (selectedAnswer === null) return;

        const result = QuizEngine.submitAnswer(selectedAnswer);
        setAnswerResult(result);
    };

    const handleNext = async () => {
        if (answerResult.isLastQuestion) {
            const results = await QuizEngine.getResults();
            setQuizResults(results);
            setViewState('result');
            refreshProfile(); // Update XP/Level in context
        } else {
            QuizEngine.nextQuestion();
            loadQuestion();
        }
    };

    // PLAYING VIEW
    const renderPlaying = () => {
        if (!currentQuestion) return null;

        return (
            <View style={styles.container}>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Card style={styles.questionCard}>
                        <Text style={styles.questionText}>{currentQuestion.question}</Text>
                    </Card>

                    <View style={styles.optionsContainer}>
                        {currentQuestion.options.map((option, index) => {
                            let optionStyle = styles.optionButton;
                            let textStyle = styles.optionText;

                            if (answerResult) {
                                if (index === currentQuestion.correctAnswer) {
                                    optionStyle = styles.optionCorrect;
                                } else if (index === selectedAnswer && !answerResult.isCorrect) {
                                    optionStyle = styles.optionWrong;
                                }
                            } else if (selectedAnswer === index) {
                                optionStyle = styles.optionSelected;
                            }

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={optionStyle}
                                    onPress={() => handleAnswerFn(index)}
                                    disabled={!!answerResult}
                                >
                                    <Text style={textStyle}>{option}</Text>
                                    {answerResult && index === currentQuestion.correctAnswer && (
                                        <CheckCircle color={COLORS.success} size={20} />
                                    )}
                                    {answerResult && index === selectedAnswer && !answerResult.isCorrect && (
                                        <XCircle color={COLORS.danger} size={20} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {answerResult && (
                        <View style={styles.feedbackContainer}>
                            <View style={[styles.feedbackHeader, { backgroundColor: answerResult.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                                <Text style={[styles.feedbackTitle, { color: answerResult.isCorrect ? COLORS.success : COLORS.danger }]}>
                                    {answerResult.isCorrect ? 'Correct!' : 'Incorrect'}
                                </Text>
                            </View>
                            <Text style={styles.explanation}>{answerResult.explanation}</Text>
                            <Button
                                title={answerResult.isLastQuestion ? "Finish Quiz" : "Next Question"}
                                onPress={handleNext}
                                icon={<ArrowRight size={20} color="white" />}
                                style={{ marginTop: SPACING.md }}
                            />
                        </View>
                    )}
                </ScrollView>

                {!answerResult && (
                    <View style={styles.footer}>
                        <Button
                            title="Submit Answer"
                            onPress={submitAnswerFn}
                            disabled={selectedAnswer === null}
                        />
                    </View>
                )}
            </View>
        );
    };

    // RESULT VIEW
    const renderResult = () => {
        if (!quizResults) return null;

        return (
            <ScrollView contentContainerStyle={styles.resultContainer}>
                <Text style={styles.resultTitle}>Quiz Complete!</Text>

                <Card style={styles.scoreCard}>
                    <Text style={styles.scoreLabel}>Your Score</Text>
                    <Text style={styles.scoreValue}>{quizResults.score}%</Text>
                    <Text style={styles.scoreDetail}>{quizResults.correctCount} / {quizResults.totalQuestions} Correct</Text>
                </Card>

                <View style={styles.xpResult}>
                    <Text style={styles.xpLabel}>XP Earned</Text>
                    <Text style={styles.xpValue}>+{quizResults.xpEarned} XP</Text>
                    {quizResults.levelUp && (
                        <Text style={styles.levelUpText}>🎉 Level Up! You are now Level {quizResults.newLevel}</Text>
                    )}
                </View>

                <Button
                    title="Back to Menu"
                    variant="outline"
                    icon={<RotateCcw size={20} color="white" />}
                    onPress={() => {
                        QuizEngine.reset();
                        setViewState('menu');
                    }}
                    style={{ marginTop: SPACING.xl }}
                />
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {viewState === 'menu' && renderMenu()}
            {viewState === 'playing' && renderPlaying()}
            {viewState === 'result' && renderResult()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgDark,
    },
    scrollContent: {
        padding: SPACING.md,
    },
    pageTitle: {
        fontSize: FONTS.size3xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.xl,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
    },
    categoryCard: {
        width: '47%', // 2 columns approx
        aspectRatio: 1,
        backgroundColor: COLORS.bgMedium,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        marginBottom: SPACING.xs,
    },
    catIcon: {
        fontSize: 40,
        marginBottom: SPACING.sm,
    },
    catName: {
        fontSize: FONTS.sizeMd,
        fontWeight: 'bold',
    },
    questionCard: {
        minHeight: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    questionText: {
        fontSize: FONTS.sizeLg,
        fontWeight: 'bold',
        color: COLORS.textDark,
        textAlign: 'center',
    },
    optionsContainer: {
        gap: SPACING.md,
    },
    optionButton: {
        backgroundColor: COLORS.bgLight,
        padding: SPACING.lg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionSelected: {
        backgroundColor: COLORS.primary, // Selected state before submit
        padding: SPACING.lg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primaryLight,
    },
    optionCorrect: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: COLORS.success,
        borderWidth: 1,
        padding: SPACING.lg,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionWrong: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: COLORS.danger,
        borderWidth: 1,
        padding: SPACING.lg,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionText: {
        color: COLORS.textPrimary,
        fontSize: FONTS.sizeMd,
        flex: 1,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: COLORS.bgMedium,
        width: '100%',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primaryLight,
    },
    footer: {
        padding: SPACING.md,
        borderTopWidth: 1,
        borderColor: COLORS.border,
    },
    feedbackContainer: {
        marginTop: SPACING.lg,
        backgroundColor: COLORS.bgLight,
        borderRadius: 12,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    feedbackHeader: {
        padding: SPACING.sm,
        borderRadius: 8,
        marginBottom: SPACING.sm,
        alignSelf: 'flex-start',
    },
    feedbackTitle: {
        fontWeight: 'bold',
        fontSize: FONTS.sizeMd,
    },
    explanation: {
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    resultTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xl,
    },
    scoreCard: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: SPACING.xl,
        marginBottom: SPACING.lg,
    },
    scoreLabel: {
        color: COLORS.textDarkSecondary,
        fontSize: FONTS.sizeLg,
        marginBottom: SPACING.xs,
    },
    scoreValue: {
        fontSize: 64,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    scoreDetail: {
        color: COLORS.textDarkMuted,
        fontSize: FONTS.sizeMd,
        marginTop: SPACING.sm,
    },
    xpResult: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    xpLabel: {
        color: COLORS.textSecondary,
    },
    xpValue: {
        fontSize: FONTS.size2xl,
        fontWeight: 'bold',
        color: COLORS.warning,
        marginTop: 4,
    },
    levelUpText: {
        color: COLORS.success,
        fontWeight: 'bold',
        fontSize: FONTS.sizeLg,
        marginTop: SPACING.md,
        textAlign: 'center',
    }
});

export default QuizScreen;
