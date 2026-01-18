
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTS } from '../constants/theme';

export const Card = ({ children, title, style, description }) => {
    return (
        <View style={[styles.card, style]}>
            {title && (
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    {description && <Text style={styles.description}>{description}</Text>}
                </View>
            )}
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 16, // xl
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        // Shadow (iOS)
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        // Elevation (Android)
        elevation: 5,
    },
    header: {
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: FONTS.size2xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary, // Fallback if gradient not applied to text (RN text gradient is tricky)
        marginBottom: SPACING.xs,
    },
    description: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizeSm,
    }
});
