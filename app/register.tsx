import { registerPhone } from '@/lib/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        if (!phone) {
            Alert.alert('Утасны дугаар оруулна уу');
            return;
        }

        try {
            setLoading(true);
            const res = await registerPhone(phone);

            try {
                await registerPhone(phone);
                router.push({
                    pathname: '/verify',
                    params: { phone },
                });
            } catch (e: any) {
                Alert.alert('Алдаа', e.message);
            }
        } catch (e: any) {
            Alert.alert('Алдаа', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Бүртгүүлэх</Text>

            <TextInput
                placeholder="Утасны дугаар"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
            />

            <TouchableOpacity style={styles.btn} onPress={handleNext} disabled={loading}>
                <Text style={styles.btnText}>
                    {loading ? 'Түр хүлээнэ үү…' : 'Үргэлжлүүлэх'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 14,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    btn: {
        height: 52,
        borderRadius: 14,
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
