import DrinkSetCard from '@/components/drinkMenuItem';
import FeaturedCard from '@/components/featuredCard';
import HomeSlider from '@/components/homeSlider';
import ServiceCategoryCard from '@/components/serviceCategoryCard';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
const DEFAULT_SLIDES = [
  { id: '1', image: 'https://picsum.photos/800/400?1' },
  { id: '2', image: 'https://picsum.photos/800/400?2' },
  { id: '3', image: 'https://picsum.photos/800/400?3' },
];
const FEATURED = [
  {
    id: 'd1',
    name: 'Ari',
    role: 'Strip dancer',
    rating: 4.9,
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'd2',
    name: 'Luna',
    role: 'Strip dancer',
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/150?img=13',
  },
  {
    id: 'd3',
    name: 'Luna',
    role: 'Strip dancer',
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/150?img=14',
  },
  {
    id: 'd4',
    name: 'Luna',
    role: 'Strip dancer',
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
];

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
];

const DRINK_SETS = [
  {
    id: 'set1',
    name: 'Classic Set',
    desc: '2–3 хүн суухад тохиромжтой',
    price: '180,000₮',
    badge: 'POPULAR',
    items: [
      'Whiskey x1',
      'Vodka x1',
      'Soft drink x2',
      'Ice + Lemon',
    ],
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
];


export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}

      showsVerticalScrollIndicator={false}
    >
      {/* 🔄 Slider */}
      <HomeSlider />

      {/* ⭐ Featured dancers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Өнөөдрийн GIRLS
        </Text>

        <FlatList
          data={FEATURED}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FeaturedCard item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <Text style={[styles.sectionTitle, styles.listTitle]}>
        Drink Set
      </Text>

      {DRINK_SETS.map((item) => (
        <DrinkSetCard key={item.id} item={item} />
      ))}

      {/* 🧩 Other services */}
      <Text style={[styles.sectionTitle, styles.listTitle]}>
        Бусад үйлчилгээ
      </Text>

      {SERVICES.map((item) => (
        <ServiceCategoryCard key={item.id} item={item} />
      ))}


    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },

  content: {
    paddingBottom: 24, // 🔥 доод хэсэгт зай
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

  menuWrapper: {
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 24,
  },
});
