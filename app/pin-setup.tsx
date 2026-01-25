import { setUserPin } from '@/lib/api'
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

export default function PinSetupScreen() {
  const router = useRouter()

  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    // 1️⃣ frontend validation
    if (pin.length !== 4) {
      Alert.alert('Алдаа', 'PIN код 4 оронтой байх ёстой')
      return
    }

    if (pin !== confirm) {
      Alert.alert('Алдаа', 'PIN таарахгүй байна')
      return
    }

    try {
      setSaving(true)

      // 2️⃣ 🔥 PIN-ийг BACKEND рүү хадгална
      await setUserPin(pin)

      // 3️⃣ session unlock (PIN өөрөө хадгалагдахгүй)
      await AsyncStorage.setItem('pin_unlocked', '1')

      // 4️⃣ app руу оруулна
      router.replace('/(tabs)')
    } catch (e: any) {
      Alert.alert(
        'Алдаа',
        e?.message ?? 'PIN хадгалж чадсангүй'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PIN тохируулах</Text>
      <Text style={styles.sub}>
        Апп-д нэвтрэх 4 оронтой PIN үүсгэнэ үү
      </Text>

      <TextInput
        placeholder="PIN"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        value={pin}
        onChangeText={setPin}
        style={styles.input}
        autoFocus
      />

      <TextInput
        placeholder="PIN давтах"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
      />

      <TouchableOpacity
        style={[
          styles.btn,
          (pin.length < 4 || confirm.length < 4 || saving) && {
            opacity: 0.5,
          },
        ]}
        disabled={pin.length < 4 || confirm.length < 4 || saving}
        onPress={handleSave}
      >
        <Text style={styles.btnText}>
          {saving ? 'Хадгалж байна…' : 'Хадгалах'}
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
    marginBottom: 16,
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
