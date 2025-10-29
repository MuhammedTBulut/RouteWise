import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@routewise_token';
const REFRESH_TOKEN_KEY = '@routewise_refresh_token';
const USER_KEY = '@routewise_user';

export const saveAuthData = async (
  accessToken: string,
  refreshToken: string,
  user: any
): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, accessToken],
      [REFRESH_TOKEN_KEY, refreshToken],
      [USER_KEY, JSON.stringify(user)],
    ]);
  } catch (error) {
    console.error('Error saving auth data:', error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

export const getUser = async (): Promise<any | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};
