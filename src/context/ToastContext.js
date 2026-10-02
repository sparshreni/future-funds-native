
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONTS } from '../constants/theme';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react-native';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    const hideToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <View style={styles.toastContainer}>
                {toasts.map(toast => (
                    <ToastItem key={toast.id} {...toast} onHide={() => hideToast(toast.id)} />
                ))}
            </View>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ message, type, duration, onHide }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(duration),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => onHide());
    }, []);

    // Info toasts use the indigo surface with a purple outline
    let bg = COLORS.surface;
    let borderColor = COLORS.primary;
    let icon = <Info color={COLORS.primaryLight} size={20} />;

    if (type === 'success') {
        bg = COLORS.success;
        borderColor = COLORS.success;
        icon = <CheckCircle color="white" size={20} />;
    } else if (type === 'error') {
        bg = COLORS.error;
        borderColor = COLORS.error;
        icon = <AlertCircle color="white" size={20} />;
    }

    return (
        <Animated.View style={[styles.toast, { opacity, backgroundColor: bg, borderColor }]}>
            <View style={styles.content}>
                {icon}
                <Text style={styles.text}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        top: 60, // Below header usually, or just top safe area
        left: 20,
        right: 20,
        gap: 10,
        zIndex: 9999,
        elevation: 9999,
    },
    toast: {
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: FONTS.sizeMd,
    }
});
