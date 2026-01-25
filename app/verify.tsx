import { verifyOtp } from '@/lib/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function VerifyScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const phone = String(params.phone);

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            Alert.alert('Алдаа', '6 оронтой OTP оруулна уу');
            return;
        }

        try {
            setLoading(true);

            // 🔥 ХЭРВЭЭ OTP БУРУУ БОЛ → ЭНД THROW → CATCH
            await verifyOtp(phone, otp);

            // 🔥 ЭНД ИРСЭН Л БОЛ OTP ЗӨВ
            router.replace({
                pathname: '/set-password',
                params: { phone },
            });
        } catch (e: any) {
            // 🔥 SERVER-ЭЭС ИРСЭН АЛДАА
            Alert.alert('Алдаа', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>OTP баталгаажуулах</Text>

            <TextInput
                placeholder="OTP код"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                style={styles.code}
            />

            <TouchableOpacity
                style={[styles.btn, loading && { opacity: 0.6 }]}
                onPress={handleVerify}
                disabled={loading}
            >
                <Text style={styles.btnText}>
                    {loading ? 'Шалгаж байна…' : 'Баталгаажуулах'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 24,
    },
    code: {
        height: 60,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 14,
        textAlign: 'center',
        fontSize: 22,
        marginBottom: 20,
    },
    btn: {
        height: 52,
        borderRadius: 14,
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
