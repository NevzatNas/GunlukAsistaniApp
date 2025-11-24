import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { analyzeText } from '../api/aiService';
import { generateIdempotencyKey } from '../utils/helpers';

export const JournalContext = createContext();

export const JournalProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Başlangıçta verileri yükle
  useEffect(() => {
    loadFromStorage();
  }, []);

  const loadFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem('@journal_entries');
      if (stored) setEntries(JSON.parse(stored));
    } catch (e) {
      console.error("Storage Error:", e);
    }
  };

  const saveToStorage = async (newEntries) => {
    try {
      await AsyncStorage.setItem('@journal_entries', JSON.stringify(newEntries));
    } catch (e) {
      console.error("Save Error:", e);
    }
  };

  const processEntry = async (text) => {
    if (!text.trim()) return false;
    
    setLoading(true);
    setError(null);

    try {
      // API Katmanını Çağır
      const aiResult = await analyzeText(text);

      const newEntry = {
        id: generateIdempotencyKey(),
        date: new Date().toISOString(),
        text,
        ...aiResult
      };

      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      await saveToStorage(updatedEntries);
      
      setLoading(false);
      return true; // Başarılı
    } catch (err) {
      setError("İşlem sırasında bir hata oluştu.");
      setLoading(false);
      return false; // Başarısız
    }
  };

  const clearHistory = async () => {
    setEntries([]);
    await AsyncStorage.removeItem('@journal_entries');
  };

  return (
    <JournalContext.Provider value={{ 
      entries, 
      processEntry, 
      clearHistory, 
      loading, 
      error 
    }}>
      {children}
    </JournalContext.Provider>
  );
};