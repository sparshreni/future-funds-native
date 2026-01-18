
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONTS } from '../constants/theme';

export const Badge = ({ icon, name, variant = 'primary' }) => {
    let colors = COLORS.gradientPrimary;
    if (variant === 'success') colors = COLORS.gradientSuccess;
    if (variant === 'danger') colors = COLORS.gradientDanger;
    if (variant === 'warning') colors = ['#f59e0b', '#d97706']; // Custom warning gradient

    return (
        <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.badge}
        >
            <Text style={styles.icon}>{icon}</Text>
            {name && <Text style={styles.name}>{name}</Text>}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 999,
        alignSelf: 'flex-start',
    },
    icon: {
        fontSize: FONTS.sizeXs,
        marginRight: 4,
    },
    name: {
        color: 'white',
        fontSize: FONTS.sizeXs,
        fontWeight: 'bold',
    }
});
