import {SafeAreaView} from 'react-native';
import {useAuth} from './src/context/AuthContext';
import Login from './src/screens/login/Index';
import HomeTabs from './src/screens/home/HomeStack';

export const AuthRoutes = ({Stack}) => {
  return (
    <Stack.Group>
      <Stack.Screen
        name="AuthRoot"
        component={HomeTabs}
        options={{headerShown: false}}
      />
    </Stack.Group>
  );
};

export const UnAuthRoutes = ({Stack}) => {
  return (
    // <Stack.Group>
    <Stack.Screen
      name="splashScreen"
      component={Login}
      options={{headerShown: false}}
    />
    // </Stack.Group>
  );
};
