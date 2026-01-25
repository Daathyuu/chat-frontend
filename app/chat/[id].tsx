import ChatBubble from '@/components/chatBubble';
import ChatHeader from '@/components/chatHeader';
import ChatInput from '@/components/chatInput';
import { getMessages } from '@/lib/api';
import { echo } from '@/lib/echo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Message = {
  id: string;
  text: string;
  isMe: boolean;
 
  created_at: string;
};

export default function ChatRoomScreen() {
  const { id, name, avatar } = useLocalSearchParams<{ id: string; name: string; avatar: string }>();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([]);
  const myUserIdRef = useRef<number | null>(null);
  const loadingRef = useRef(false);

  /* --------------------------------------------------
   * 1️⃣ USER ID (1 удаа)
   * -------------------------------------------------- */
  useEffect(() => {
    AsyncStorage.getItem('user_id').then((uid) => {
      myUserIdRef.current = Number(uid);
    });
  }, []);

  /* --------------------------------------------------
   * 2️⃣ FETCH MESSAGES (polling-д ашиглана)
   * -------------------------------------------------- */
  const loadMessages = async () => {
    if (!id || loadingRef.current) return;

    try {
      loadingRef.current = true;

      const data = await getMessages(Number(id));
      const myUserId = myUserIdRef.current;

      const mapped: Message[] = data.map((m: any) => ({
        id: String(m.id),
        text: m.message,
        isMe: m.user_id === myUserId,
        created_at: m.created_at,
      }));

      // inverted FlatList тул reverse
      setMessages(mapped.reverse());
    } catch (e: any) {
      Alert.alert('Алдаа', e.message);
    } finally {
      loadingRef.current = false;
    }
  };

  /* --------------------------------------------------
   * 3️⃣ INITIAL LOAD
   * -------------------------------------------------- */
  useEffect(() => {
    loadMessages();
  }, [id]);

  function formatDateTime(dateString: string) {
    const d = new Date(dateString);

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');

    return `${y}-${m}-${day} ${h}:${min}`;
  }

  /* --------------------------------------------------
   * 4️⃣ REALTIME LISTENING
   * -------------------------------------------------- */
  useEffect(() => {
    if (!id) return;

    const channel = `chat.${id}`;
    console.log('📡 Listening:', channel);

    echo.private(channel)
      .listen('MessageSent', (e: any) => {
        const msg = e.message;

        console.log('🔥 REALTIME MESSAGE:', msg);

        setMessages(prev => {
          // давхар орохоос сэргийлнэ
          if (prev.some(m => m.id === String(msg.id))) {
            return prev;
          }

          return [
            {
              id: String(msg.id),
              text: msg.message,
              isMe: msg.user_id === myUserIdRef.current,
              created_at: msg.created_at,
            },
            ...prev,
          ];
        });
      });

    return () => {
      echo.leave(`private-${channel}`);
    };
  }, [id]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ChatHeader chatId={String(id)} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.messages}
          inverted
        />

        <View style={{ paddingBottom: insets.bottom }}>
          <ChatInput
            chatId={Number(id)}
            onSent={(text: string) => {
              
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
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
});
