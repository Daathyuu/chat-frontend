import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SecurityScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const handleLockNow = async () => {
    await AsyncStorage.removeItem('pin_unlocked')
    Alert.alert('Түгжигдлээ', 'Апп дахин нээхийн тулд PIN оруулна')
    router.replace('/pin')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.title}>Нууцлал & аюулгүй байдал</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* ICON */}
      <View style={styles.iconSection}>
        <View style={styles.shield}>
          <Ionicons name="shield-checkmark" size={44} color="#fff" />
        </View>
        <Text style={styles.hint}>
          Апп-ийн аюулгүй байдлын дүрэм, хяналтыг эндээс удирдана
        </Text>
      </View>

      {/* ACTIONS */}
      <View style={styles.card}>
        <Item
          icon="lock-open-outline"
          title="Одоо түгжих"
          subtitle="Апп-ийг шууд PIN-ээр түгжинэ"
          danger
          onPress={handleLockNow}
        />
      </View>

      {/* INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          • Апп background ормогц автоматаар түгжинэ{'\n'}
          • 5 минут идэвхгүй байвал PIN дахин асууна{'\n'}
          • PIN болон нууц үг Profile хэсгээс солигдоно
        </Text>
      </View>
    </View>
  )
}

/* ================= COMPONENTS ================= */

function Item({
  icon,
  title,
  subtitle,
  danger,
  onPress,
}: {
  icon: any
  title: string
  subtitle?: string
  danger?: boolean
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconWrap,
          danger && { backgroundColor: '#fee' },
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={danger ? '#e53935' : '#111'}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.itemTitle,
            danger && { color: '#e53935' },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.itemSub}>{subtitle}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
  },

  iconSection: {
    alignItems: 'center',
    marginBottom: 24,
  },

  shield: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  hint: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 24,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },

  itemSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  infoBox: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f7f7f7',
  },

  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
})
