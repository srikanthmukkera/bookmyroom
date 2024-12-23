import React, {useEffect, useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useAsyncStorageM(key, defaultValue) {
  const [storageValue, updateStorageValue] = useState(defaultValue);

  const getStorageValue = useCallback(async () => {
    try {
      const storedValue = await AsyncStorage.getItem(key);
      const value = storedValue ? JSON.parse(storedValue) : defaultValue;
      if (JSON.stringify(value) !== JSON.stringify(storageValue)) {
        updateStorageValue(value);
      }
    } catch (e) {
      console.error('Error getting AsyncStorage value:', e);
    }
  }, [key, defaultValue, storageValue]);

  const updateStorage = useCallback(
    async newValue => {
      try {
        if (newValue !== undefined && newValue !== null) {
          await AsyncStorage.setItem(key, JSON.stringify(newValue));
          updateStorageValue(newValue);
        } else {
          console.error(
            `Error: Attempted to store invalid value: ${newValue} for key: ${key}`,
          );
        }
      } catch (e) {
        console.error('Error setting AsyncStorage value:', e);
      }
    },
    [key],
  );

  useEffect(() => {
    getStorageValue();
  }, [getStorageValue]);

  return [storageValue, updateStorage];
}
