import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Message = {
  id: string;
  text: string;
  isMe: boolean;
  created_at: string;
};
function formatShortTime(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatFullDateTime(dateString: string) {
  const d = new Date(dateString);

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const sec = String(d.getSeconds()).padStart(2, '0');

  return `${y}-${m}-${day} ${h}:${min}:${sec}`;
}

export default function ChatBubble({ message }: { message: Message }) {

  const [showFullTime, setShowFullTime] = useState(false);


  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setShowFullTime(prev => !prev)}
    >
      <View
        style={[
          styles.bubble,
          message.isMe ? styles.me : styles.other,
        ]}
      >
        <Text style={styles.text}>{message.text}</Text>

        <Text style={styles.time}>
          {showFullTime
            ? formatFullDateTime(message.created_at)
            : formatShortTime(message.created_at)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  me: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',

  },
  other: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEE',
  },
  text: {
    fontSize: 16,
  },
  time: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});
