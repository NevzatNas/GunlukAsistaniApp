import React, { useState, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ActivityIndicator, StatusBar, Keyboard, SafeAreaView 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { JournalContext } from '../context/JournalContext';
import { THEME } from '../config/theme';
import SmartIllustration from '../components/SmartIllustration'; // Yeni bileşenimiz

const HomeScreen = () => {
  const [text, setText] = useState('');
  const { processEntry, loading, entries } = useContext(JournalContext);
  const lastEntry = entries[0];

  const handleAnalyze = async () => {
    const success = await processEntry(text);
    if (success) {
      setText('');
      Keyboard.dismiss();
    }
  };

  // Dinamik Gradient
  let bgColors = THEME.sentiment.neutral;
  if (lastEntry?.sentiment === 'positive') bgColors = THEME.sentiment.positive;
  if (lastEntry?.sentiment === 'negative') bgColors = THEME.sentiment.negative;

  return (
    <LinearGradient colors={bgColors} style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* İçerik Kutusu */}
        <View style={styles.contentWrapper}>
          
          {/* Sonuç Kartı */}
          <View style={[styles.card, THEME.shadows.strong]}>
            {lastEntry ? (
              <>
                <View style={styles.illustrationArea}>
                  <SmartIllustration sentiment={lastEntry.sentiment} />
                </View>
                
                <Text style={styles.sentimentTitle}>
                  {lastEntry.sentiment === 'positive' ? 'Harika Hissediyorsun!' : 
                   lastEntry.sentiment === 'negative' ? 'Zor Bir Gün...' : 'Sakin ve Dengeli'}
                </Text>
                
                <Text style={styles.summaryText}>{lastEntry.summary}</Text>
                
                <View style={styles.suggestionBox}>
                  <Icon name="lightbulb-on-outline" size={20} color={THEME.colors.primary} style={{marginRight: 8}} />
                  <Text style={styles.suggestionText}>{lastEntry.suggestion}</Text>
                </View>
              </>
            ) : (
              <View style={styles.emptyState}>
                <SmartIllustration sentiment="neutral" />
                <Text style={styles.emptyText}>Günlüğüne Hoş Geldin</Text>
                <Text style={styles.subEmptyText}>Bugün neler yaşadın? Anlat, yapay zeka analiz etsin.</Text>
              </View>
            )}
          </View>

          {/* Input Alanı - Floating Design */}
          <View style={[styles.inputCard, THEME.shadows.soft]}>
            <TextInput
              style={styles.input}
              placeholder="Düşüncelerini buraya dök..."
              placeholderTextColor={THEME.colors.placeholder}
              multiline
              value={text}
              onChangeText={setText}
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.fabButton, (!text.trim() || loading) && styles.disabledButton]} 
              onPress={handleAnalyze}
              disabled={!text.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Icon name="send" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentWrapper: { flex: 1, padding: 20, justifyContent: 'center' },
  card: { 
    backgroundColor: THEME.colors.cardBg, 
    borderRadius: 30, 
    padding: 25, 
    minHeight: 320, 
    alignItems: 'center',
    marginBottom: 25,
  },
  illustrationArea: { marginBottom: 10 },
  sentimentTitle: { fontSize: 22, fontWeight: '800', color: THEME.colors.text, marginBottom: 10, textAlign: 'center' },
  summaryText: { fontSize: 15, color: THEME.colors.textLight, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  suggestionBox: { 
    flexDirection: 'row',
    backgroundColor: '#F0F3FF', 
    padding: 15, 
    borderRadius: 20, 
    width: '100%',
    alignItems: 'center'
  },
  suggestionText: { flex: 1, fontSize: 13, color: THEME.colors.primary, fontWeight: '600' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: THEME.colors.accent, marginTop: 10 },
  subEmptyText: { fontSize: 14, color: THEME.colors.placeholder, textAlign: 'center', marginTop: 8, maxWidth: 200 },
  
  inputCard: { 
    backgroundColor: 'white', 
    borderRadius: 25, 
    padding: 10, 
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { flex: 1, fontSize: 16, color: THEME.colors.text, maxHeight: 80, paddingVertical: 15 },
  fabButton: { 
    backgroundColor: THEME.colors.primary, 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: 10,
    elevation: 2
  },
  disabledButton: { backgroundColor: THEME.colors.disabled },
});

export default HomeScreen;