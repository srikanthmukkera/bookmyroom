import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';

import useAsyncStorageM from '../utils/asyncStorage/useAsyncStorageM';
import {
  AppState,
  Dimensions,
  FlatList,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {ScrollView} from 'react-native-gesture-handler';

const ThemeContext = createContext({
  safeAreaWidth: 0,
  setSafeAreaWidth: () => {},
  safeAreaHeight: 0,
  setSafeAreaHeight: () => {},
  orientation: 'portrait',
  appStateVisible: 'background',
  setAppState: () => {},
  keyBoardStatus: false,
  setKeyBordStatus: () => {},
  showBottomTab: true,
  setShowBottomTab: () => {},
  showBottomSheet: {isActive: false, index: -1, height: 200, children: null},
  setShowBottomSheet: () => {},
});

export const ThemeProvider = ({children}) => {
  const bottomSheetRef = useRef(null);
  const [keyBoardStatus, setKeyBordStatus] = useState(false);
  const [orientation, setOrientation] = useAsyncStorageM(
    'orientation',
    'portrait',
  );
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useAsyncStorageM(
    'appstate',
    appState.current,
  );
  const {width, height} = Dimensions.get('window');
  const [safeAreaWidth, setSafeAreaWidth] = useAsyncStorageM('safearea', 0);
  const [safeAreaHeight, setSafeAreaHeight] = useAsyncStorageM(
    'safeareaheight',
    0,
  );
  const [showBottomTab, setShowBottomTab] = useAsyncStorageM(
    'showBottomTab',
    true,
  );
  const [showBottomSheet, setShowBottomSheet] = useState({
    isActive: false,
    index: -1,
    height: safeAreaHeight * 0.6,
    children: null,
  });

  const handleOrientationChange = () => {
    console.log(orientation, 'changing orientation ==== ');

    setOrientation(width > height ? 'landscape' : 'portrait');
  };

  useEffect(() => {
    Dimensions.addEventListener('change', handleOrientationChange);
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });
    // Orientation.lockToPortrait();
    handleOrientationChange(); // Set initial orientation

    return () => {
      if (Dimensions && Dimensions?.removeEventListener)
        Dimensions.removeEventListener('change', handleOrientationChange);
      subscription?.remove?.();
    };
  }, []);

  useEffect(() => {
    if (showBottomSheet.isActive) {
      handleOpenSheet();
    } else {
      handleCloseSheet();
    }
  }, [showBottomSheet]);

  const handleSheetChanges = useCallback(
    index => {
      console.log('handleSheetChanges', index);
      if (index === -1)
        setShowBottomSheet({isActive: false, index, children: null});
      // else setShowBottomSheet({...showBottomSheet, index, isActive: true});
    },
    [showBottomSheet],
  );

  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.expand(); // Open to the first snap point
    //
  }, []);

  const handleCloseSheet = useCallback(() => {
    bottomSheetRef.current?.close(); // Close the bottom sheet
  }, []);

  const values = useMemo(
    () => ({
      windowWidth: width,
      windowHeight: height,

      keyBoardStatus,
      setKeyBordStatus,
      safeAreaWidth,
      setSafeAreaWidth,
      safeAreaHeight,
      setSafeAreaHeight,
      orientation,
      appStateVisible,
      setAppStateVisible,
      showBottomTab,
      setShowBottomTab,
      showBottomSheet,
      setShowBottomSheet,
    }),
    [
      width,
      height,
      safeAreaWidth,
      safeAreaHeight,
      orientation,
      appStateVisible,
      keyBoardStatus,
      showBottomTab,
      showBottomSheet,
    ],
  );

  return (
    <ThemeContext.Provider value={values}>
      <SafeAreaView style={{flex: 1}}>{children}</SafeAreaView>
      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose
        enableDynamicSizing={false}
        snapPoints={[showBottomSheet?.height || 200]}
        index={-1}
        onChange={handleSheetChanges}>
        {showBottomSheet.children}
      </BottomSheet>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

export default ThemeContext;
