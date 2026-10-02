import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { Bot } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const AIAgentBubble = () => {
  return (
    <GlassView
      intensity={80} 
      glassEffectStyle="regular" // The 2026 "Liquid" look
      tintColor={COLORS.primary} // FutureFunds green
      isInteractive={true}
      style={styles.bubbleContainer}
    >
      <TouchableOpacity 
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        style={styles.touchable}
      >
        <Bot color="#FFF" size={32} />
      </TouchableOpacity>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    position: 'absolute',
    bottom: 90, // Above the bottom tab bar
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  touchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default AIAgentBubble;
