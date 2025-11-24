import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      const userData = await AsyncStorage.getItem('@user_data');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    // Simüle edilmiş login isteği
    setLoading(true);
    setTimeout(async () => {
      // Token'a bilerek 'old' diyoruz ki secureFetch içinde 401 hatasını test edebilelim
      const mockToken = "old_access_token_123"; 
      const mockUser = { name: username, id: 1 };

      await AsyncStorage.setItem('@auth_token', mockToken);
      await AsyncStorage.setItem('@user_data', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@auth_token');
    await AsyncStorage.removeItem('@user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};