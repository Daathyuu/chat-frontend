import { verifyUserPin } from '@/lib/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

export default function PinScreen() {
  const router = useRouter()

  const [pin, setPin] = useState('')
  const [checking, setChecking] = useState(false)

  const handleVerify = async () => {
    if (pin.length !== 4) {
      Alert.alert('Алдаа', 'PIN код 4 оронтой байх ёстой')
      return
    }

    try {
      setChecking(true)

      // ✅ PIN-ийг USER дээр verify хийнэ
      await verifyUserPin(pin)

      // ✅ session unlock (local flag)
      await AsyncStorage.setItem('pin_unlocked', '1')

      router.replace('/(tabs)')
    } catch (e: any) {
      Alert.alert(
        'Алдаа',
        e?.message ?? 'PIN код буруу байна'
      )
    } finally {
      setChecking(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PIN код</Text>
      <Text style={styles.sub}>
        Апп-д нэвтрэх PIN-ээ оруулна уу
      </Text>

      <TextInput
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        value={pin}
        onChangeText={setPin}
        style={styles.input}
        autoFocus
      />

      <TouchableOpacity
        style={[
          styles.btn,
          (pin.length < 4 || checking) && { opacity: 0.5 },
        ]}
        disabled={pin.length < 4 || checking}
        onPress={handleVerify}
      >
        <Text style={styles.btnText}>
          {checking ? 'Шалгаж байна…' : 'Нэвтрэх'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  sub: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  input: {
    height: 64,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    textAlign: 'center',
    fontSize: 22,
    letterSpacing: 10,
    marginBottom: 20,
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
})
