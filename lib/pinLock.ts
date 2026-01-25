import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native'

let lockTimer: ReturnType<typeof setTimeout> | null = null
const LOCK_AFTER_MS = 5 * 60 * 1000 // 5 минут

async function lockPin() {
    await AsyncStorage.removeItem('pin_unlocked')
}

function startTimer() {
    clearTimer()
    lockTimer = setTimeout(() => {
        lockPin()
    }, LOCK_AFTER_MS)
}

function clearTimer() {
    if (lockTimer) {
        clearTimeout(lockTimer)
        lockTimer = null
    }
}

export function initPinLock() {
    // ⏱️ app active үед timer эхлүүлнэ
    startTimer()

    AppState.addEventListener('change', async (state) => {
        if (state === 'background' || state === 'inactive') {
            // 🔒 app гармагц түгжинэ
            await lockPin()
            clearTimer()
        }

        if (state === 'active') {
            // app руу ормогц timer дахин эхлэнэ
            startTimer()
        }
    })
}

