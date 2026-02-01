import { getMe } from '@/lib/api'
import { echo } from '@/lib/echo'
import { initPinLock } from '@/lib/pinLock'
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
      try {
        // 🔐 session start бүрт PIN force lock
        await AsyncStorage.removeItem('pin_unlocked')

        const token = await AsyncStorage.getItem('token')
        const invite = await AsyncStorage.getItem('invite_verified')
        const pinUnlocked = await AsyncStorage.getItem('pin_unlocked')

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

        // 3️⃣ User data (DB reset safe)
        const me = await getMe()

        // 4️⃣ PIN setup байхгүй
        if (!me?.is_pin_set) {
          router.replace('/pin-setup')
          return
        }

        // 5️⃣ PIN unlock
        if (pinUnlocked !== '1') {
          router.replace('/pin')
          return
        }

        // 6️⃣ Socket connect (BLOCK хийхгүй)
        try {
          echo.options.auth ??= { headers: {} }
          echo.options.auth.headers.Authorization = `Bearer ${token}`
          echo.connect()
        } catch (e) {
          console.log('Echo connect failed (ignored)')
        }

        // 7️⃣ Auto lock (background + 5 min)
        initPinLock()

        // 8️⃣ App
        router.replace('/(tabs)')
      } catch (e) {
        // 🔥 DB reset / token invalid → SAFE FALLBACK
        await AsyncStorage.multiRemove([
          'token',
          'invite_verified',
          'pin_unlocked',
        ])
        router.replace('/login')
      } finally {
        if (mounted) setChecking(false)
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [])

  // ⏳ init хийж байх үед
  if (checking) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    )
  }

  // redirect хийчихсэн тул UI хэрэггүй
  return null
}
