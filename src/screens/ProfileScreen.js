
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useUser } from '../context/UserContext';
import Storage from '../utils/storage';
import Gamification from '../utils/gamification';
import { BadgeCheck, Lock } from 'lucide-react-native';

const ProfileScreen = ({ navigation }) => {
    const { userProfile, refreshProfile } = useUser();
    const [unlockedBadges, setUnlockedBadges] = useState([]);
    const [lockedBadges, setLockedBadges] = useState([]);

    useEffect(() => {
        loadBadges();
    }, [userProfile]);

    const loadBadges = async () => {
        const unlocked = await Gamification.getUnlockedBadges();
        const locked = await Gamification.getLockedBadges();
        setUnlockedBadges(unlocked);
        setLockedBadges(locked);
    };

    const handleReset = () => {
        Alert.alert(
            "Reset Progress",
            "Are you sure? This will delete ALL progress, badges, and history. This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: async () => {
                        await Storage.clearAll();
                        // Reload app context essentially
                        // In a real app we might restart or re-init context
                        // For now we'll just refresh profile which might re-init default
                        await Storage.initUserProfile();
                        refreshProfile();
                    }
                }
            ]
        );
    };

    const handleGradeChange = async (grade) => {
        await Storage.updateProfile({ gradeLevel: grade });
        refreshProfile();
        Alert.alert("Success", "Grade level updated!");
    };

    if (!userProfile) return null;

    const getCreditColor = (score) => {
        if (score >= 740) return '#10b981';
        if (score >= 670) return '#06b6d4';
        if (score >= 580) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <Card style={styles.headerCard}>
                    <View style={styles.avatar}>
                        <Text style={{ fontSize: 40 }}>👤</Text>
                    </View>
                    <Text style={styles.name}>Student Profile</Text>
                    <Text style={styles.memberSince}>Member since {new Date(userProfile.createdAt).toLocaleDateString()}</Text>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>Level {userProfile.level || 1}</Text>
                    </View>
                </Card>

                <View style={styles.grid}>
                    {/* Stats */}
                    <Card title="Statistics" style={{ flex: 1 }}>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Total XP</Text>
                            <Text style={styles.statValue}>{userProfile.xp}</Text>
                        </View>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Streak</Text>
                            <Text style={styles.statValue}>{userProfile.streak} days</Text>
                        </View>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Credit Score</Text>
                            <Text style={[styles.statValue, { color: getCreditColor(userProfile.creditScore) }]}>{userProfile.creditScore}</Text>
                        </View>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Portfolio</Text>
                            <Text style={styles.statValue}>${userProfile.portfolioValue?.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.statRow, { borderBottomWidth: 0 }]}>
                            <Text style={styles.statLabel}>Grade</Text>
                            <Text style={[styles.statValue, { textTransform: 'capitalize' }]}>{userProfile.gradeLevel || 'Not set'}</Text>
                        </View>
                    </Card>
                </View>

                {/* Settings */}
                <Card title="Settings">
                    <Text style={styles.label}>Change Grade Level</Text>
                    <View style={styles.gradeButtons}>
                        {['elementary', 'middle', 'high'].map(grade => (
                            <TouchableOpacity
                                key={grade}
                                style={[
                                    styles.gradeBtn,
                                    userProfile.gradeLevel === grade && styles.gradeBtnActive
                                ]}
                                onPress={() => handleGradeChange(grade)}
                            >
                                <Text style={[
                                    styles.gradeBtnText,
                                    userProfile.gradeLevel === grade && styles.gradeBtnTextActive
                                ]}>{grade.charAt(0).toUpperCase() + grade.slice(1)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Button
                        title="Reset All Progress"
                        variant="danger"
                        onPress={handleReset}
                        style={{ marginTop: SPACING.md }}
                    />
                </Card>

                {/* Achievements */}
                <Card title={`Achievements (${unlockedBadges.length}/${unlockedBadges.length + lockedBadges.length})`}>
                    <View style={styles.badgeList}>
                        {unlockedBadges.map(badge => (
                            <View key={badge.id} style={[styles.badgeCard, styles.unlockedBadge]}>
                                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                                <View style={styles.badgeInfo}>
                                    <Text style={styles.badgeName}>{badge.name}</Text>
                                    <Text style={styles.badgeDesc}>{badge.description}</Text>
                                </View>
                            </View>
                        ))}
                        {lockedBadges.map(badge => (
                            <View key={badge.id} style={[styles.badgeCard, styles.lockedBadge]}>
                                <View style={styles.badgeIcon}>
                                    <Lock color={COLORS.textMuted} size={24} />
                                </View>
                                <View style={styles.badgeInfo}>
                                    <Text style={[styles.badgeName, { color: COLORS.textMuted }]}>{badge.name}</Text>
                                    <Text style={styles.badgeDesc}>{badge.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </Card>

            </ScrollView>
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
    headerCard: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    name: {
        fontSize: FONTS.size2xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    memberSince: {
        color: COLORS.textMuted,
        marginBottom: SPACING.md,
    },
    levelBadge: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
    },
    levelText: {
        color: 'white',
        fontWeight: 'bold',
    },
    grid: {
        marginBottom: SPACING.md,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    statLabel: {
        color: COLORS.textSecondary,
    },
    statValue: {
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    label: {
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    gradeButtons: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    gradeBtn: {
        flex: 1,
        padding: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        alignItems: 'center',
    },
    gradeBtnActive: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primaryLight,
    },
    gradeBtnText: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    gradeBtnTextActive: {
        color: 'white',
        fontWeight: 'bold',
    },
    badgeList: {
        gap: SPACING.sm,
    },
    badgeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        gap: SPACING.md,
    },
    unlockedBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    lockedBadge: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderColor: COLORS.border,
        opacity: 0.7,
    },
    badgeIcon: {
        width: 40,
        fontSize: 24,
        textAlign: 'center',
    },
    badgeInfo: {
        flex: 1,
    },
    badgeName: {
        color: COLORS.textPrimary,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    badgeDesc: {
        color: COLORS.textSecondary,
        fontSize: 12,
    }
});

export default ProfileScreen;
