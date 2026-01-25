import { verifyInvite } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function InviteScreen() {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (code.length !== 6) {
            Alert.alert('Алдаа', '6 оронтой код оруулна уу');
            return;
        }

        try {
            setLoading(true);

            // 🔥 BACKEND ДУУДЛАГА
            await verifyInvite(code);
            // ❌ буруу бол api.ts дээр throw → catch орно

            // 🔥 АМЖИЛТТАЙ БОЛ
            await AsyncStorage.setItem('invite_verified', '1');

            router.replace('/(tabs)');
        } catch (e: any) {
            // 🔥 SERVER-ЭЭС ИРСЭН АЛДАА
            Alert.alert('Алдаа', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Тусгай код</Text>
            <Text style={styles.sub}>
                Байгууллагаас өгсөн 6 оронтой кодыг оруулна уу → энэ кодыг
                зөвхөн эхний удаа асууна
            </Text>

            <TextInput
                placeholder="6 оронтой код"
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={setCode}
                style={styles.code}
            />

            <TouchableOpacity style={styles.btn} onPress={handleVerify}>
                <Text style={styles.btnText}>Баталгаажуулах</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        justifyContent: 'center',
    },

    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#111',
        marginBottom: 10,
    },

    sub: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 28,
    },

    code: {
        height: 64,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 16,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '600',

        marginBottom: 24,
    },

    btn: {
        height: 54,
        borderRadius: 16,
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
    },

    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },

    hint: {
        marginTop: 20,
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
});
