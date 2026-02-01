import { getMe, sendMessage } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  chatId: number;
  onSent?: (text: string) => void;
};

export default function ChatInput({ chatId, onSent }: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  /* ================= GET ME ================= */
  useEffect(() => {
    let mounted = true;

    getMe()
      .then((user) => {
        if (!mounted) return;
        // 🔥 getMe() -> User object
        setUserId(user.id);
      })
      .catch(() => {
        setUserId(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  /* ================= SEND ================= */
  const handleSend = async () => {
    if (!text.trim() || sending || !userId) return;

    const message = text.trim();

    try {
      setSending(true);

      await sendMessage({
        chat_id: chatId,
        user_id: userId,
        message,
      });

      setText("");
      onSent?.(message);
    } finally {
      setSending(false);
    }
  };

  const disabled = !text.trim() || sending || !userId;

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
        style={[styles.sendBtn, disabled && { opacity: 0.5 }]}
        onPress={handleSend}
        disabled={disabled}
        activeOpacity={0.8}
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

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 0.5,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    maxHeight: 120,
    borderRadius: 18,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111",
  },

  sendBtn: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
});
