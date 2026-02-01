// lib/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
}