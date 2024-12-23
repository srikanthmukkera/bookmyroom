/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useRef} from 'react';
import {enableScreens} from 'react-native-screens';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import './global.css';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider, useAuth} from './src/context/AuthContext';
import {AuthRoutes, UnAuthRoutes} from './routes';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import Orientation from 'react-native-orientation-locker';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

enableScreens();
function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <ThemeProvider>
          <AuthProvider>
            <Navigates />
          </AuthProvider>
        </ThemeProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const Stack = createStackNavigator();
const Navigates = ({}) => {
  useEffect(() => {
    Orientation.lockToPortrait();
    // Orientation.unlockAllOrientations();
  }, []);
  const {user} = useAuth();
  const {setSafeAreaHeight, setSafeAreaWidth} = useTheme();
  const {width: windowWIdth, height: windowHeight} = Dimensions.get('window');

  return (
    <View className="flex-1">
      <SafeAreaView style={{flex: 1}}>
        <View
          className="flex-1 w-full h-full"
          onLayout={event => {
            const {width, height} = event?.nativeEvent?.layout || {
              width: 0,
              height: 0,
            };
            console.log(width, height, 'on layout changes');

            setSafeAreaWidth(isNaN(width) ? windowWIdth : width);
            setSafeAreaHeight(isNaN(height) ? windowHeight : height);
          }}>
          {user && user?.user_type_name ? (
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}>
              {AuthRoutes({Stack, user})}
            </Stack.Navigator>
          ) : (
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}>
              {UnAuthRoutes({Stack})}
            </Stack.Navigator>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default App;
