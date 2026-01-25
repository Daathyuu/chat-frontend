import { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
  { id: '1', image: 'https://picsum.photos/800/400?random=1' },
  { id: '2', image: 'https://picsum.photos/800/400?random=2' },
  { id: '3', image: 'https://picsum.photos/800/400?random=3' },
];

export default function HomeSlider() {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(
            e.nativeEvent.contentOffset.x / width
          );
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      />

      {/* pagination */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              index === i && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 220, // 🔥 ЭНЭ БАЙХГҮЙ БОЛ ХАРАГДАХГҮЙ
  },

  image: {
    width,
    height: 220,
  },

  dots: {
    position: 'absolute',
    bottom: 12,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: '#fff',
    width: 10,
  },
});
