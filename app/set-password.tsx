import { setPassword } from '@/lib/api';
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

export default function SetPasswordScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const phone = String(params.phone); // ✅ ГОЛ ЗАСВАР

    const [password, setPasswordState] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSetPassword = async () => {
        if (!phone || phone === 'undefined') {
            Alert.alert('Алдаа', 'Утасны дугаар олдсонгүй');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Алдаа', 'Нууц үг хамгийн багадаа 6 тэмдэгт байна');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Алдаа', 'Нууц үг таарахгүй байна');
            return;
        }

        try {
            setLoading(true);

            const res = await setPassword(phone, password);
            Alert.alert('Амжилттай', 'Бүртгэл амжилттай', [
                { text: 'OK', onPress: () => router.replace('/login') },
            ]);
            return;

        } catch {
            Alert.alert('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Нууц үг үүсгэх</Text>

            <TextInput
                placeholder="Нууц үг"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPasswordState}
                style={styles.input}
            />

            <TextInput
                placeholder="Нууц үг баталгаажуулах"
                placeholderTextColor="#999"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
            />

            <TouchableOpacity
                style={styles.btn}
                onPress={handleSetPassword}
                disabled={loading}
            >
                <Text style={styles.btnText}>
                    {loading ? 'Хадгалж байна…' : 'Үргэлжлүүлэх'}
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
        color: '#111',
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 15,          // ⬅ хэвийн текст
        fontWeight: '400',    // ⬅ placeholder italic / bold БИШ
        marginBottom: 16,
        color: '#111',
    },

    btn: {
        height: 52,
        borderRadius: 14,
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },

    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
