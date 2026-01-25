import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function GateScreen() {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const inviteVerified = await AsyncStorage.getItem('invite_verified');
            const pinSet = await AsyncStorage.getItem('pin_set');

            if (!inviteVerified) {
                router.replace('/invite');
                return;
            }

            if (!pinSet) {
                router.replace('/pin-setup');
                return;
            }

            router.replace('/(tabs)');
        })();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );
}
