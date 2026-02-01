import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import DrinkSetCard from '@/components/drinkMenuItem'
import FeaturedCard from '@/components/featuredCard'
import HomeSlider from '@/components/homeSlider'
import ServiceCategoryCard from '@/components/serviceCategoryCard'

import { getDancers } from '@/lib/api'

/* ================= TYPES ================= */

type Dancer = {
  id: number
  name: string
  avatar: string | null
  phone: string
  pivot: {
    status: string
    dancer_schedule_id: number
    user_id: number
    finished_at: string | null
    created_at: string
    updated_at: string
  }
}

/* ================= STATIC DATA ================= */

const SERVICES = [
  {
    id: 's1',
    title: 'VIP өрөө',
    subtitle: 'Хувийн орчин, premium үйлчилгээ',
    icon: '💎',
    bg: '#6C5CE7',
    onPress: () => Alert.alert('VIP өрөө', 'VIP захиалга удахгүй'),
  },
  {
    id: 's2',
    title: 'Private dance',
    subtitle: '1-on-1 тусгай бүжиг',
    icon: '🔥',
    bg: '#E84393',
    onPress: () => Alert.alert('Private dance', 'Захиалга удахгүй'),
  },
  {
    id: 's3',
    title: 'Event booking',
    subtitle: 'Үдэшлэг, эвент захиалах',
    icon: '🎉',
    bg: '#00B894',
    onPress: () => Alert.alert('Event booking', 'Дэлгэрэнгүй удахгүй'),
  },
  {
    id: 's4',
    title: 'Tips & gifts',
    subtitle: 'Дэмжлэг, бэлэг илгээх',
    icon: '🎁',
    bg: '#0984E3',
    onPress: () => Alert.alert('Tips & gifts', 'Функц удахгүй'),
  },
]

const DRINK_SETS = [
  {
    id: 'set1',
    name: 'Classic Set',
    desc: '2–3 хүн суухад тохиромжтой',
    price: '180,000₮',
    badge: 'POPULAR',
    items: ['Whiskey x1', 'Vodka x1', 'Soft drink x2', 'Ice + Lemon'],
  },
  {
    id: 'set2',
    name: 'VIP Set',
    desc: 'VIP өрөөнд зориулсан багц',
    price: '350,000₮',
    badge: 'VIP',
    items: [
      'Premium Whiskey x1',
      'Champagne x1',
      'Energy drink x2',
      'Fruit platter',
    ],
  },
  {
    id: 'set3',
    name: 'Party Set',
    desc: 'Олуулаа суухад',
    price: '520,000₮',
    items: [
      'Vodka x2',
      'Cocktail pitcher x1',
      'Soft drink x4',
      'Ice bucket',
    ],
  },
]

/* ================= SCREEN ================= */

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [dancers, setDancers] = useState<Dancer[]>([])
  const [loading, setLoading] = useState(true)

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchDancers = async () => {
      try {
        const res = await getDancers()

        // API чинь ARRAY буцааж байна
        const workingGirls = Array.isArray(res)
          ? res.filter(d => d.pivot?.status === 'working')
          : []

        setDancers(workingGirls)
      } catch (e) {
        Alert.alert('Алдаа', 'Dancer татаж чадсангүй')
      } finally {
        setLoading(false)
      }
    }

    fetchDancers()
  }, [])

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* SLIDER */}
      <HomeSlider />

      {/* FEATURED */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Өнөөдөр гарах Girls
        </Text>

        {loading ? (
          <Text style={styles.infoText}>Уншиж байна...</Text>
        ) : dancers.length === 0 ? (
          <Text style={styles.infoText}>
            Одоогоор ажиллаж байгаа dancer алга
          </Text>
        ) : (
          <FlatList
            data={dancers}
            horizontal
            keyExtractor={item => String(item.id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 12,
            }}
            renderItem={({ item }) => (
              <FeaturedCard
                dancer={item}
                onPress={() =>
                  router.push({
                    pathname: '/dancer/[id]',
                    params: { id: item.id },
                  })
                }
              />
            )}
          />
        )}
      </View>

      {/* DRINK SET */}
      <Text style={[styles.sectionTitle, styles.listTitle]}>
        Drink Set
      </Text>

      {DRINK_SETS.map(item => (
        <DrinkSetCard key={item.id} item={item} />
      ))}

      {/* SERVICES */}
      <Text style={[styles.sectionTitle, styles.listTitle]}>
        Бусад үйлчилгээ
      </Text>

      {SERVICES.map(item => (
        <ServiceCategoryCard key={item.id} item={item} />
      ))}
    </ScrollView>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  listTitle: {
    marginTop: 24,
  },
  infoText: {
    paddingHorizontal: 16,
    color: '#777',
  },
})
