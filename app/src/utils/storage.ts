import AsyncStorage from '@react-native-async-storage/async-storage';

export type StorageKeys = 'token' | 'user';

const save = (key: StorageKeys, value: string) => AsyncStorage.setItem(key, value);

const get = (key: StorageKeys) => AsyncStorage.getItem(key);

const clear = (key: StorageKeys) => AsyncStorage.removeItem(key);

const Storage = {
  save,
  clear,
  get,
};

export default Storage;
