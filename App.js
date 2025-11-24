import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Artık ekranları ve context'i dışarıdan (src klasöründen) alıyoruz
import { JournalProvider } from './src/context/JournalContext';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { THEME } from './src/config/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <JournalProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: THEME.colors.primary,
            tabBarInactiveTintColor: THEME.colors.placeholder,
            tabBarStyle: { paddingBottom: 5, height: 60 },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Günlük') {
                iconName = focused ? 'notebook' : 'notebook-outline';
              } else if (route.name === 'Geçmiş') {
                iconName = focused ? 'history' : 'calendar-clock';
              }
              return <Icon name={iconName} size={28} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Günlük" component={HomeScreen} />
          <Tab.Screen name="Geçmiş" component={HistoryScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </JournalProvider>
  );
}