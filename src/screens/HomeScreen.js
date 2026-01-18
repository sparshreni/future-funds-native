
import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useUser } from '../context/UserContext';

const HomeScreen = ({ navigation }) => {
    const { userProfile, loading } = useUser();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.logoIcon}>💰</Text>
                    <Text style={styles.logoText}>FutureFunds</Text>
                </View>

                {/* Hero Section */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>Master Your Money</Text>
                    <Text style={styles.heroSubtitle}>
                        Learn budgeting, investing, and credit scores through interactive games.
                    </Text>
                    <View style={styles.heroButtons}>
                        <Button
                            title="Start Learning"
                            onPress={() => navigation.navigate('Dashboard')}
                            size="lg"
                            style={{ flex: 1 }}
                        />
                    </View>
                </View>

                {/* Features Grid */}
                <Text style={styles.sectionTitle}>Key Features</Text>

                <Card style={styles.featureCard}>
                    <Text style={styles.featureIcon}>📊</Text>
                    <Text style={styles.featureTitle}>Interactive Dashboard</Text>
                    <Text style={styles.featureDesc}>Track your progress, streaks, and achievements in real-time.</Text>
                </Card>

                <Card style={styles.featureCard}>
                    <Text style={styles.featureIcon}>📈</Text>
                    <Text style={styles.featureTitle}>Paper Trading</Text>
                    <Text style={styles.featureDesc}>Practice investing with $1,000 virtual cash. Zero risk, real learning.</Text>
                </Card>

                <Card style={styles.featureCard}>
                    <Text style={styles.featureIcon}>💳</Text>
                    <Text style={styles.featureTitle}>Credit Simulator</Text>
                    <Text style={styles.featureDesc}>Make decisions and see how they impact your credit score.</Text>
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
    scrollContent: {
        padding: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
        marginTop: SPACING.lg,
    },
    logoIcon: {
        fontSize: FONTS.size2xl,
        marginRight: SPACING.xs,
    },
    logoText: {
        fontSize: FONTS.size2xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    hero: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    heroTitle: {
        fontSize: FONTS.size4xl,
        fontWeight: '800',
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    heroSubtitle: {
        fontSize: FONTS.sizeLg,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    heroButtons: {
        flexDirection: 'row',
        width: '100%',
        maxWidth: 300,
    },
    sectionTitle: {
        fontSize: FONTS.sizeXl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    featureCard: {
        alignItems: 'flex-start',
    },
    featureIcon: {
        fontSize: FONTS.size4xl,
        marginBottom: SPACING.sm,
    },
    featureTitle: {
        fontSize: FONTS.sizeLg,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    featureDesc: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizeBase,
    }
});

export default HomeScreen;
