import React, {useState} from 'react';
import {Button, Dimensions, Text, TouchableOpacity, View} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import HomeScreen from './HomeScreen';
import {FlatList} from 'react-native-gesture-handler';
import Profile from '../profile/Profile';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {useTheme} from '../../context/ThemeContext';
import Icon from '@react-native-vector-icons/fontawesome6';
import Checkout from './Checkout';

const Tab = createBottomTabNavigator();
const {height} = Dimensions.get('window');

function FloatingTabBar({state, descriptors, navigation, showBottomTab}) {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = showBottomTab ? 0 : height * 0.15;
  }, [showBottomTab]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: withSpring(translateY.value, {damping: 12})}],
  }));

  return (
    <Animated.View
      className="w-[90%] flex flex-row mx-auto absolute rounded-full bg-[#521f77] blur-2xl justify-around left-[5%] p-2  bottom-2"
      style={[animatedStyle]}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            className="p-3 rounded-full aspect-square flex justify-center  items-center gap-y-1 "
            key={route.key}
            onPress={onPress}
            title={label}>
            <Icon
              name={route.name === 'Home' ? 'map' : 'user'}
              color={'white'}
              size={16}
            />
            <Text
              className={`text-[10px] sm:text-sm md:text-base ${
                isFocused ? 'ont-bold text-[#fff] ' : 'text-[#decece]'
              }`}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}
const Stack = createStackNavigator();
function HomeStack({...props}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name="/"
        component={HomeScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="checkout"
        component={Checkout}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function HomeTabs(props) {
  const {showBottomTab} = useTheme();
  const {logout} = useAuth();
  return (
    <View className="flex-1 w-full h-full relative">
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {display: 'none'}, // Hide default tab bar
          animationEnabled: true,
          cardStyleInterpolator: ({current, layouts}) => ({
            cardStyle: {
              transform: [
                {
                  translateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.height, 0], // Slide from bottom
                  }),
                },
              ],
            },
          }),
        }}
        tabBar={props => (
          <FloatingTabBar {...props} showBottomTab={showBottomTab} />
        )}>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </View>
  );
}

export default HomeTabs;
