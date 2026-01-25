import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function FeaturedCard({ item }: any) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
        router.push({
          pathname: '/dancer/[id]',
          params: { id: item.id },
        })
      }
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.role}>{item.role}</Text>
      <Text style={styles.rating}>⭐ {item.rating}</Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  card: {
    width: 150,
    marginLeft: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#fff',
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  name: {
    fontWeight: '700',
    fontSize: 14,
    color: '#111',
  },
  role: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
    marginTop: 4,
  },
  chatBtn: {
    marginTop: 10,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
