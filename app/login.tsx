import { login } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Алдаа', 'Мэдээллээ бүрэн оруулна уу');
      return;
    }

    try {
      setLoading(true);

      // 🔥 өмнөх token байвал устгана
      await AsyncStorage.removeItem('token');

      // 🔥 LOGIN API
      const data = await login(phone, password);
      // ❌ буруу бол api.ts дээр throw → catch орно

      // 🔑 TOKEN ХАДГАЛНА
      await AsyncStorage.setItem('token', data.token);

      // 🔥 AMJILTTAY LOGIN
      router.replace('/gate'); // эсвэл '/'
    } catch (e: any) {
      // 🔥 SERVER-ЭЭС ИРСЭН АЛДАА
      Alert.alert('Алдаа', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ paddingTop: insets.top + 40 }}>
        <Text style={styles.title}>Нэвтрэх</Text>
        <Text style={styles.subtitle}>
          Өөрийн бүртгэлээр нэвтэрнэ үү
        </Text>

        <TextInput
          placeholder="Утасны дугаар"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />

        <TextInput
          placeholder="Нууц үг"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity
          style={[
            styles.loginBtn,
            (!phone || !password || loading) && { opacity: 0.5 },
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>
            {loading ? 'Шалгаж байна…' : 'Нэвтрэх'}
          </Text>
        </TouchableOpacity>

        <View style={styles.extra}>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.link}>Бүртгүүлэх</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 32,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 14,
  },
  loginBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  extra: {
    marginTop: 24,
    alignItems: 'center',
  },
  link: {
    color: '#111',
    fontSize: 14,
  },
});
