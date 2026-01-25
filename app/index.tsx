import { getMe } from '@/lib/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

export default function Index() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const token = await AsyncStorage.getItem('token')
      const invite = await AsyncStorage.getItem('invite_verified')
      const pinUnlocked = await AsyncStorage.getItem('pin_unlocked')

      if (!mounted) return

      // 1️⃣ Login
      if (!token) {
        router.replace('/login')
        return
      }

      // 2️⃣ Invite
      if (invite !== '1') {
        router.replace('/invite')
        return
      }

      // 3️⃣ USER DATA → is_pin_set
      let me
      try {
        me = await getMe()
      } catch {
        router.replace('/login')
        return
      }

      // 4️⃣ PIN байхгүй → PIN SETUP
      if (!me.is_pin_set) {
        router.replace('/pin-setup')
        return
      }

      // 5️⃣ PIN байгаа ч unlock хийгдээгүй → PIN CHECK
      if (pinUnlocked !== '1') {
        router.replace('/pin')
        return
      }

      // 6️⃣ БҮГД OK
      router.replace('/(tabs)')
    }

    init().finally(() => {
      if (mounted) setChecking(false)
    })

    return () => {
      mounted = false
    }
  }, [])

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return null
}
