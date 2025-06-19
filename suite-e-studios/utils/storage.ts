/** @format */

import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveSetting(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // Optionally log error
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export async function saveChecklistCache(
  key: string,
  value: object
): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Optionally log error
  }
}

export async function getChecklistCache<T = unknown>(
  key: string
): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? (JSON.parse(json) as T) : null;
  } catch (e) {
    return null;
  }
}
