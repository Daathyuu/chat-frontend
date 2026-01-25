import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

export type Chat = {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread?: number
}

type Props = {
  chat: Chat
  onPress: () => void
}

const formatTime = (t: string) => {
  if (!t) return ''
  const d = new Date(t.replace(' ', 'T'))
  return d.toLocaleDateString('en-GB', {
    month: 'short',
    day: '2-digit',
  })
}

export default function ChatListItem({ chat, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: chat.avatar }} style={styles.avatar} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {chat.name}
          </Text>

          {!!chat.time && (
            <Text style={styles.time}>{formatTime(chat.time)}</Text>
          )}
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {chat.lastMessage || ''}
          </Text>

          {!!chat.unread && chat.unread > 0 && (
            <View style={styles.unread}>
              <Text style={styles.unreadText}>{chat.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    maxWidth: '75%',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  lastMessage: {
    flex: 1,
    color: '#666',
    fontSize: 14,
  },
  unread: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
})
