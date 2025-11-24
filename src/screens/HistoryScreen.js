import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { JournalContext } from '../context/JournalContext';
import { THEME } from '../config/theme';
import { formatDate } from '../utils/helpers';

const HistoryScreen = () => {
  const { entries, clearHistory } = useContext(JournalContext);

  const renderItem = ({ item }) => {
    // DÜZELTME: Artık 'theme.js' dosyasındaki duygu renklerini (Sarı/Gri) kullanıyoruz.
    // Gradient dizisinin ilk rengini ana renk olarak alıyoruz.
    const sentimentColors = THEME.sentiment[item.sentiment] || THEME.sentiment.neutral;
    const mainColor = sentimentColors[0]; // Ana renk (Örn: Sarı veya Gri)

    return (
      <View style={[styles.itemCard, THEME.shadows.soft]}>
        {/* Sol Şerit: Duygu Rengi */}
        <View style={[styles.colorStrip, { backgroundColor: mainColor }]} />
        
        <View style={styles.cardContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
            
            {/* Badge: Duygu Rengiyle Uyumlu */}
            <View style={[styles.badge, { backgroundColor: mainColor + '20' }]}>
              <Text style={[styles.badgeText, { color: mainColor }]}>
                {item.sentiment ? item.sentiment.toUpperCase() : 'NÖTR'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.itemText} numberOfLines={2}>{item.text}</Text>
          
          <View style={styles.suggestionRow}>
            <Icon name="magic-staff" size={14} color={THEME.colors.textLight} />
            <Text style={styles.itemSuggestion} numberOfLines={1}> {item.suggestion}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={[styles.header, THEME.shadows.soft]}>
        <Text style={styles.title}>Zaman Tüneli</Text>
        {entries.length > 0 && (
          <TouchableOpacity onPress={clearHistory} style={styles.clearBtn}>
            <Icon name="trash-can-outline" size={22} color={THEME.colors.danger} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="notebook-off" size={64} color={THEME.colors.disabled} />
            <Text style={styles.emptyText}>Henüz bir anı biriktirmedin.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    paddingTop: 15,
    backgroundColor: 'white', 
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10
  },
  title: { fontSize: 24, fontWeight: '800', color: THEME.colors.accent },
  list: { padding: 20 },
  itemCard: { 
    backgroundColor: 'white', 
    borderRadius: 16, 
    marginBottom: 16, 
    flexDirection: 'row',
    overflow: 'hidden' 
  },
  colorStrip: { width: 6, height: '100%' },
  cardContent: { flex: 1, padding: 16 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  date: { fontSize: 12, color: '#B2BEC3', fontWeight: '600' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  itemText: { fontSize: 15, color: '#2D3436', marginBottom: 10, lineHeight: 20 },
  suggestionRow: { flexDirection: 'row', alignItems: 'center' },
  itemSuggestion: { fontSize: 12, color: '#636E72', fontStyle: 'italic', flex: 1 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 15, color: '#B2BEC3', fontSize: 16, fontWeight: '500' }
});

export default HistoryScreen;