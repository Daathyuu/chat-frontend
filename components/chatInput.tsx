import { sendMessage } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  chatId: number;
  onSent?: (text: string) => void;
};

export default function ChatInput({ chatId, onSent }: Props) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  /**
   * 🔑 user_id-г AsyncStorage-с авна
   * (chat list татах үед хадгалсан)
   */
  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem('user_id').then((id) => {
      if (mounted && id) {
        setUserId(Number(id));
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    if (sending) return;
    if (!userId) return;

    try {
      setSending(true);

      await sendMessage({
        chat_id: chatId,
        user_id: userId,
        message: text.trim(),
      });

      setText('');
      onSent?.(text);
    } catch {
      // ❗ алдааг parent component барина
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Мессеж бичих…"
        placeholderTextColor="#999"
        style={styles.input}
        multiline
      />

      <TouchableOpacity
        style={[
          styles.sendBtn,
          (!text.trim() || sending || !userId) && {
            opacity: 0.5,
          },
        ]}
        onPress={handleSend}
        disabled={!text.trim() || sending || !userId}
      >
        {sending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Ionicons name="send" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    maxHeight: 120,
    borderRadius: 18,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111',
  },

  sendBtn: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
