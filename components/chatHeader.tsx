import { getChats } from '@/lib/api'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

type Props = {
  chatId: string
}

type HeaderUser = {
  id: number
  name: string
  avatar: string
}

export default function ChatHeader({ chatId }: Props) {
  const router = useRouter()

  const [user, setUser] = useState<HeaderUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

      ; (async () => {
        try {
          const res = await getChats()
          const chats = Array.isArray(res) ? res : res.data

          if (!Array.isArray(chats)) return

          const chat = chats.find(
            (c: any) => String(c.chat_id) === String(chatId)
          )

          if (!chat || !chat.user) return

          if (mounted) {
            setUser({
              id: chat.user.id,
              name: chat.user.name,
              avatar:
                chat.user.avatar ??
                `https://i.pravatar.cc/150?u=${chat.user.id}`,
            })
          }
        } finally {
          if (mounted) setLoading(false)
        }
      })()

    return () => {
      mounted = false
    }
  }, [chatId])

  return (
    <View style={styles.container}>
      {/* 🔙 BACK */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backBtn}
        hitSlop={10}
      >
        <Ionicons name="chevron-back" size={26} color="#111" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity
          style={styles.user}
           onPress={() => router.push(`/dancer/${user?.id}`)}
        >
          <Image
            source={{ uri: user?.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.name} numberOfLines={1}>
            {user?.name ?? 'Chat'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  user: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },

  backBtn: {
    paddingHorizontal: 8,
    marginRight: 4,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    backgroundColor: '#eee',
  },

  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
    flexShrink: 1,
  },
})
