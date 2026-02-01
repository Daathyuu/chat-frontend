import { withBaseUrl } from '@/lib/media'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Dancer = {
  id: number
  name: string
  avatar: string | null
  pivot: {
    status: string
  }
}

type Props = {
  dancer: Dancer
  onPress?: () => void
}

export default function FeaturedCard({ dancer, onPress }: Props) {
  const avatar =
    dancer.avatar
      ? withBaseUrl(dancer.avatar)
      : withBaseUrl('/images/noavatar.jpg')

  const isWorking = dancer.pivot?.status === 'working'

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* AVATAR */}
      <Image source={{ uri: avatar }} style={styles.avatar} />

      {/* INFO */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {dancer.name}
        </Text>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.dot,
              { backgroundColor: isWorking ? '#2ecc71' : '#ccc' },
            ]}
          />
          <Text style={styles.status}>

          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 12,
    overflow: 'hidden',
    elevation: 2,
  },

  avatar: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee',
  },

  info: {
    padding: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  status: {
    fontSize: 12,
    color: '#666',
  },
})
