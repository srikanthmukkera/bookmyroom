import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import useAsyncStorageM from '../utils/asyncStorage/useAsyncStorageM';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

const AuthContext = createContext({
  user: null,
  loader: null,
  token: null,
  logout: () => {},
  login: () => {},
  selectedLanguage: '',
  setSelectedLanguage: () => {},
  repTypes: [],
  setRepTypes: () => {},
  gamificationData: {},
  setGamificationData: () => {},
  selectedDate: null,
  setSelectedDate: () => {},
  deviceToken: null,
  userPhoto: 1,
  setUserPhoto: () => {},
});

export const AuthProvider = ({children}) => {
  const [selectedDate, setSelectedDate] = useState(
    moment().format('MM-DD-YYYY'),
  );
  const [user, setUser] = useAsyncStorageM('user', null);
  const [token, setToken] = useAsyncStorageM('token', '');
  const [loader, setLoader] = useState(false);
  const [userPhoto, setUserPhoto] = useAsyncStorageM('photo', 1);
  const [deviceToken, setDeviceToken] = useAsyncStorageM('deviceToken', '');
  const login = async data => {
    setLoader(true);

    if (data?.user?.user_type_name) {
      setUser(data?.user);
      setToken(data?.token);
    }
  };

  const logout = async () => {
    setUser({...user, user_type_name: ''});
    try {
    } catch (err) {}
    setToken('');
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      token,
      loader,
      setLoader,
      userPhoto,
      setUserPhoto,
      selectedDate,
      setSelectedDate,
      deviceToken,
      setDeviceToken,
    }),
    [user, token, loader, userPhoto, deviceToken, selectedDate],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
