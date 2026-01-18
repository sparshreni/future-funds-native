
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useUser } from '../context/UserContext';
import CreditScenarios from '../data/creditScenarios';
import Storage from '../utils/storage';
import Gamification from '../utils/gamification';
import { TrendingUp, TrendingDown, Info } from 'lucide-react-native';

const CreditScreen = ({ navigation }) => {
    const { userProfile, refreshProfile } = useUser();
    const [modalVisible, setModalVisible] = useState(false);
    const [currentScenario, setCurrentScenario] = useState(null);
    const [result, setResult] = useState(null);

    const startScenario = () => {
        const scenario = CreditScenarios.getRandomScenario();
        setCurrentScenario(scenario);
        setResult(null);
        setModalVisible(true);
    };

    const handleChoice = async (choice) => {
        const newScore = Math.max(300, Math.min(850, userProfile.creditScore + choice.impact));

        // Update storage
        await Storage.updateProfile({ creditScore: newScore });
        await Storage.addCreditEvent({
            scenario: currentScenario.title,
            choice: choice.text,
            change: choice.impact,
            newScore,
            timestamp: Date.now()
        });

        // Check badges
        if (newScore >= 700) await Gamification.checkAndAwardBadge('credit_builder');
        if (newScore >= 800) await Gamification.checkAndAwardBadge('credit_excellent');

        // Show result
        setResult({
            choice,
            newScore
        });

        refreshProfile();
    };

    const closeScenario = () => {
        setModalVisible(false);
        setCurrentScenario(null);
        setResult(null);
    };

    const getCreditRating = (score) => {
        if (score >= 800) return 'Excellent';
        if (score >= 740) return 'Very Good';
        if (score >= 670) return 'Good';
        if (score >= 580) return 'Fair';
        return 'Poor';
    };

    const getCreditColor = (score) => {
        if (score >= 740) return '#10b981';
        if (score >= 670) return '#06b6d4';
        if (score >= 580) return '#f59e0b';
        return '#ef4444';
    };

    const rating = getCreditRating(userProfile.creditScore);
    const color = getCreditColor(userProfile.creditScore);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.pageTitle}>Credit Builder 💳</Text>

                <View style={styles.scoreContainer}>
                    <View style={[styles.circle, { borderColor: color }]}>
                        <Text style={styles.scoreValue}>{userProfile.creditScore}</Text>
                        <Text style={[styles.scoreRating, { color: color }]}>{rating}</Text>
                    </View>
                    <Text style={styles.rangeText}>Range: 300 - 850</Text>
                </View>

                <Card>
                    <Text style={styles.cardTitle}>Credit Simulator</Text>
                    <Text style={styles.cardDesc}>Face real-life financial decisions and see how they impact your credit score!</Text>
                    <Button
                        title="Start New Scenario 🎲"
                        onPress={startScenario}
                        style={{ marginTop: SPACING.md }}
                    />
                </Card>

                <Card style={{ marginTop: SPACING.lg }}>
                    <Text style={styles.cardTitle}>Tips for your score</Text>
                    <View style={styles.tipsList}>
                        {userProfile.creditScore < 670 ? (
                            <>
                                <Text style={styles.tip}>• Pay every bill on time, every time</Text>
                                <Text style={styles.tip}>• Keep credit card balances very low</Text>
                                <Text style={styles.tip}>• Avoid applying for too many new cards</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.tip}>• Maintain your good habits!</Text>
                                <Text style={styles.tip}>• Keep utilization under 30%</Text>
                                <Text style={styles.tip}>• Monitor your credit report regularly</Text>
                            </>
                        )}
                    </View>
                </Card>
            </ScrollView>

            {/* Scenario Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => { if (!result) closeScenario(); }}
            >
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        {currentScenario && !result && (
                            <>
                                <Text style={styles.scenarioTitle}>{currentScenario.title}</Text>
                                <Text style={styles.scenarioText}>{currentScenario.situation}</Text>

                                <ScrollView style={{ maxHeight: 300 }}>
                                    {currentScenario.choices.map((choice, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.choiceBtn}
                                            onPress={() => handleChoice(choice)}
                                        >
                                            <Text style={styles.choiceText}>{choice.text}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                <Button title="Cancel" variant="outline" onPress={closeScenario} style={{ marginTop: SPACING.md }} />
                            </>
                        )}

                        {result && (
                            <View style={styles.resultView}>
                                <Text style={styles.resultIcon}>{result.choice.impact >= 0 ? '👍' : '👎'}</Text>
                                <View style={styles.changeRow}>
                                    <Text style={styles.changeLabel}>Score Change:</Text>
                                    <Text style={[styles.changeValue, { color: result.choice.impact >= 0 ? COLORS.success : COLORS.danger }]}>
                                        {result.choice.impact >= 0 ? '+' : ''}{result.choice.impact}
                                    </Text>
                                </View>
                                <Text style={styles.newScore}>New Score: {result.newScore}</Text>

                                <View style={styles.explanationBox}>
                                    <Text style={styles.explanationText}>{result.choice.explanation}</Text>
                                </View>

                                <Button title="Continue" onPress={closeScenario} style={{ marginTop: SPACING.lg, width: '100%' }} />
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
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
        marginBottom: SPACING.lg,
    },
    scoreContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    circle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    scoreRating: {
        fontSize: FONTS.sizeLg,
        fontWeight: '600',
    },
    rangeText: {
        color: COLORS.textMuted,
        fontSize: FONTS.sizeSm,
    },
    cardTitle: {
        fontSize: FONTS.sizeXl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    cardDesc: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
    },
    tipsList: {
        gap: SPACING.sm,
    },
    tip: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizeMd,
    },
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: SPACING.md,
    },
    modalContent: {
        backgroundColor: COLORS.bgLight,
        borderRadius: 16,
        padding: SPACING.lg,
        maxHeight: '80%',
    },
    scenarioTitle: {
        fontSize: FONTS.size2xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    scenarioText: {
        color: COLORS.textPrimary,
        fontSize: FONTS.sizeLg,
        marginBottom: SPACING.lg,
        lineHeight: 24,
    },
    choiceBtn: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: SPACING.md,
        borderRadius: 12,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    choiceText: {
        color: COLORS.textPrimary,
        fontSize: FONTS.sizeMd,
    },
    resultView: {
        alignItems: 'center',
    },
    resultIcon: {
        fontSize: 60,
        marginBottom: SPACING.md,
    },
    changeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    changeLabel: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizeLg,
        marginRight: SPACING.sm,
    },
    changeValue: {
        fontSize: FONTS.size2xl,
        fontWeight: 'bold',
    },
    newScore: {
        color: COLORS.textPrimary,
        fontSize: FONTS.sizeXl,
        fontWeight: 'bold',
        marginBottom: SPACING.lg,
    },
    explanationBox: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: SPACING.md,
        borderRadius: 12,
        width: '100%',
    },
    explanationText: {
        color: COLORS.textSecondary,
        lineHeight: 20,
        textAlign: 'center',
    }
});

export default CreditScreen;
