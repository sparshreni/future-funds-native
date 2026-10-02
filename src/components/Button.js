
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONTS } from '../constants/theme';

export const Button = ({
    onPress,
    title,
    variant = 'primary', // primary, secondary, success, danger, outline
    size = 'md', // sm, md, lg
    disabled = false,
    loading = false,
    style,
    textStyle
}) => {

    let colors = COLORS.gradientPrimary;
    if (variant === 'secondary') colors = COLORS.gradientSecondary;
    if (variant === 'success') colors = COLORS.gradientSuccess;
    if (variant === 'danger') colors = COLORS.gradientDanger;

    const isOutline = variant === 'outline';

    const renderContent = () => (
        <>
            {loading && <ActivityIndicator size="small" color={isOutline ? COLORS.primary : 'white'} style={{ marginRight: 8 }} />}
            <Text style={[
                styles.text,
                size === 'sm' && styles.textSm,
                size === 'lg' && styles.textLg,
                isOutline && styles.textOutline,
                textStyle
            ]}>
                {title}
            </Text>
        </>
    );

    if (isOutline) {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                style={[
                    styles.base,
                    styles.outline,
                    size === 'sm' && styles.sm,
                    size === 'lg' && styles.lg,
                    (disabled || loading) && styles.disabled,
                    style
                ]}
            >
                {renderContent()}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[styles.container, style]}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.base,
                    size === 'sm' && styles.sm,
                    size === 'lg' && styles.lg,
                    (disabled || loading) && styles.disabled,
                ]}
            >
                {renderContent()}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.lg,
        borderRadius: 8,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    sm: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
    },
    lg: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
    },
    text: {
        color: 'white',
        fontWeight: '600',
        fontSize: FONTS.sizeBase,
    },
    textSm: {
        fontSize: FONTS.sizeSm,
    },
    textLg: {
        fontSize: FONTS.sizeLg,
    },
    textOutline: {
        color: COLORS.primaryLight,
    },
    disabled: {
        opacity: 0.6,
    }
});
