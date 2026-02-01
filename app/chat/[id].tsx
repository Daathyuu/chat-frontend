import ChatBubble from '@/components/chatBubble'
import ChatHeader from '@/components/chatHeader'
import ChatInput from '@/components/chatInput'
import { getMe, getMessages } from '@/lib/api'
import { echo } from '@/lib/echo'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Message = {
  id: string
  text: string
  isMe: boolean
  created_at: string
}

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()

  const [messages, setMessages] = useState<Message[]>([])
  const myUserIdRef = useRef<number | null>(null)
  const loadingRef = useRef(false)

  /* --------------------------------------------------
   * 1️⃣ LOAD USER (getMe)
   * -------------------------------------------------- */
  useEffect(() => {
    if (!id) return

    getMe()
      .then(user => {
        myUserIdRef.current = user.id
        loadMessages(user.id)
      })
      .catch(() => {
        Alert.alert('Алдаа', 'User мэдээлэл авахад алдаа гарлаа')
      })
  }, [id])

  /* --------------------------------------------------
   * 2️⃣ LOAD HISTORY
   * -------------------------------------------------- */
  const loadMessages = async (myUserId: number) => {
    if (!id || loadingRef.current) return

    try {
      loadingRef.current = true

      const data = await getMessages(Number(id))

      const mapped: Message[] = data.map((m: any) => ({
        id: String(m.id),
        text: m.message,
        isMe: m.user_id === myUserId,
        created_at: m.created_at,
      }))

      // FlatList inverted тул reverse
      setMessages(mapped.reverse())
    } catch (e: any) {
      Alert.alert('Алдаа', e.message)
    } finally {
      loadingRef.current = false
    }
  }

  /* --------------------------------------------------
   * 3️⃣ REALTIME (PRIVATE CHANNEL)
   * -------------------------------------------------- */
  useEffect(() => {
    if (!id) return

    const channel = `chat.${id}`

      ; (async () => {
        const token = await AsyncStorage.getItem('token')
        if (!token) {
          console.log('❌ TOKEN ALGA')
          return
        }

        // 🔑 TOKEN → Echo auth
        echo.connector.options.auth.headers = {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        }

        echo.connect()

        echo.private(channel)
          .listen('MessageSent', (e: any) => {
            const msg = e.message

            setMessages(prev => {
              // 🔒 duplicate хамгаалалт
              if (prev.some(m => m.id === String(msg.id))) {
                return prev
              }

              return [
                {
                  id: String(msg.id),
                  text: msg.message,
                  isMe: msg.user_id === myUserIdRef.current,
                  created_at: msg.created_at,
                },
                ...prev,
              ]
            })
          })

        // DEBUG (хүсвэл устга)
        echo.connector.pusher.connection.bind('connected', () => {
          console.log('✅ WS CONNECTED')
        })
      })()

    return () => {
      echo.leave(`private-${channel}`)
      echo.disconnect()
    }
  }, [id])

  /* --------------------------------------------------
   * 4️⃣ UI
   * -------------------------------------------------- */
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ChatHeader chatId={String(id)} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.messages}
          inverted
        />

        <View style={{ paddingBottom: insets.bottom }}>
          <ChatInput chatId={Number(id)} />
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  messages: {
    paddingTop: 12,
    paddingBottom: 8,
  },
})
