import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME } from '../config/theme';

const SmartIllustration = ({ sentiment }) => {
  // Duyguya göre ikon seti
  const getIcons = () => {
    switch (sentiment) {
      case 'positive':
        return { main: 'emoticon-cool', decor: 'star-four-points', color: '#FF9A9E' };
      case 'negative':
        return { main: 'cloud-rain', decor: 'lightning-bolt', color: '#4facfe' };
      default:
        return { main: 'robot-happy', decor: 'lightbulb-on', color: '#a18cd1' };
    }
  };

  const config = getIcons();

  return (
    <View style={styles.container}>
      {/* Arka Plan Dekoru (Büyük ve Silik) */}
      <View style={[styles.blob, { backgroundColor: config.color, opacity: 0.1 }]} />
      
      {/* Dekoratif Uçuşan İkonlar */}
      <Icon name={config.decor} size={24} color={config.color} style={styles.floating1} />
      <Icon name="circle-small" size={20} color={config.color} style={styles.floating2} />
      
      {/* Ana Karakter */}
      <Icon name={config.main} size={80} color={THEME.colors.accent} style={styles.mainIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  blob: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60, // Yuvarlak arka plan
    transform: [{ scaleX: 1.2 }], // Hafif elips
  },
  mainIcon: {
    zIndex: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  floating1: {
    position: 'absolute',
    top: 10,
    right: 10,
    transform: [{ rotate: '15deg' }],
    opacity: 0.8,
  },
  floating2: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    opacity: 0.6,
  }
});

export default SmartIllustration;