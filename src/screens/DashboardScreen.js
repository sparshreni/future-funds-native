
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import Storage from '../utils/storage';
import Gamification from '../utils/gamification';

const DashboardScreen = ({ navigation }) => {
    const { userProfile, loading, refreshProfile, getLevelInfo } = useUser();
    const [stats, setStats] = useState({
        quizzesCompleted: 0,
        perfectScores: 0,
        unlockedBadges: []
    });

    const loadStats = async () => {
        const history = await Storage.getQuizHistory();
        const unlocked = await Gamification.getUnlockedBadges();

        setStats({
            quizzesCompleted: history.length,
            perfectScores: history.filter(q => q.isPerfect).length,
            unlockedBadges: unlocked
        });
    };

    useEffect(() => {
        loadStats();
    }, [userProfile]); // Reload when profile changes

    if (loading || !userProfile) {
        return (
            <View style={styles.center}>
                <Text style={{ color: COLORS.textSecondary }}>Loading Dashboard...</Text>
            </View>
        );
    }

    const { level, progress } = getLevelInfo();

    const getCreditColor = (score) => {
        if (score >= 740) return '#10b981';
        if (score >= 670) return '#06b6d4';
        if (score >= 580) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshProfile} tintColor={COLORS.primary} />}
            >
                <Text style={styles.pageTitle}>Dashboard 📊</Text>

                {/* Level Progress */}
                <Card title="Level Progress">
                    <View style={styles.levelContainer}>
                        <Text style={styles.levelText}>Level {level}</Text>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                        </View>
                        <Text style={styles.xpText}>{userProfile.xp} XP • {Math.round(progress)}% to next level</Text>
                    </View>
                </Card>

                {/* Achievements */}
                <Card title="Achievements 🏆">
                    <View style={styles.badgeGrid}>
                        {stats.unlockedBadges.slice(0, 6).map(badge => (
                            <View key={badge.id} style={styles.badgeItem}>
                                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                                <Text style={styles.badgeName}>{badge.name}</Text>
                            </View>
                        ))}
                        {stats.unlockedBadges.length === 0 && (
                            <Text style={styles.emptyText}>Complete quizzes to earn badges!</Text>
                        )}
                    </View>
                    {/* <Button title="View All Badges" variant="outline" size="sm" style={{ marginTop: SPACING.md }} onPress={() => {}} /> */}
                </Card>

                {/* Stats Grid */}
                <View style={styles.grid3}>
                    <Card style={styles.statCard}>
                        <Text style={styles.statIcon}>📝</Text>
                        <Text style={styles.statValue}>{stats.quizzesCompleted}</Text>
                        <Text style={styles.statLabel}>Quizzes</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={styles.statIcon}>🔥</Text>
                        <Text style={styles.statValue}>{userProfile.streak}</Text>
                        <Text style={styles.statLabel}>Streak</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={styles.statIcon}>💯</Text>
                        <Text style={styles.statValue}>{stats.perfectScores}</Text>
                        <Text style={styles.statLabel}>Perfect</Text>
                    </Card>
                </View>

                {/* Financial Overview */}
                <Card title="Financial Overview">
                    <View style={styles.financialStats}>
                        <View style={styles.finStat}>
                            <Text style={styles.finLabel}>Credit Score</Text>
                            <Text style={[styles.finValue, { color: getCreditColor(userProfile.creditScore) }]}>
                                {userProfile.creditScore}
                            </Text>
                        </View>
                        <View style={styles.finStat}>
                            <Text style={styles.finLabel}>Portfolio</Text>
                            <Text style={styles.finValue}>${userProfile.portfolioValue.toFixed(2)}</Text>
                        </View>
                        <View style={styles.finStat}>
                            <Text style={styles.finLabel}>Change</Text>
                            <Text style={[styles.finValue, {
                                color: userProfile.portfolioValue >= 1000 ? COLORS.success : COLORS.danger
                            }]}>
                                {userProfile.portfolioValue >= 1000 ? '+' : ''}
                                ${(userProfile.portfolioValue - 1000).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </Card>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    levelContainer: {
        alignItems: 'center',
    },
    levelText: {
        fontSize: FONTS.size3xl,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: SPACING.sm,
    },
    progressBarBg: {
        width: '100%',
        height: 12,
        backgroundColor: COLORS.cardInset,
        borderRadius: 999,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 999,
    },
    xpText: {
        color: COLORS.textDarkSecondary,
        marginTop: SPACING.sm,
        fontSize: FONTS.sizeSm,
    },
    badgeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: SPACING.sm,
    },
    badgeItem: {
        alignItems: 'center',
        backgroundColor: COLORS.cardInset,
        padding: SPACING.sm,
        borderRadius: 8,
        width: '30%',
    },
    badgeIcon: {
        fontSize: FONTS.size2xl,
        marginBottom: 4,
    },
    badgeName: {
        color: COLORS.textDark,
        fontSize: 10,
        textAlign: 'center',
    },
    emptyText: {
        color: COLORS.textDarkMuted,
        textAlign: 'center',
        width: '100%',
        padding: SPACING.md,
    },
    grid3: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 0,
        padding: SPACING.md,
    },
    statIcon: {
        fontSize: FONTS.size2xl,
        marginBottom: SPACING.xs,
    },
    statValue: {
        fontSize: FONTS.sizeXl,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    statLabel: {
        fontSize: FONTS.sizeXs,
        color: COLORS.textDarkSecondary,
    },
    financialStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    finStat: {
        alignItems: 'center',
        flex: 1,
    },
    finLabel: {
        color: COLORS.textDarkMuted,
        fontSize: FONTS.sizeXs,
        marginBottom: 4,
    },
    finValue: {
        fontSize: FONTS.sizeLg, // Reduced size slightly to fit mobile
        fontWeight: 'bold',
        color: COLORS.textDark,
    }
});

export default DashboardScreen;
