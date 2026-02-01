import { getSliders } from '@/lib/api'
import { withBaseUrl } from '@/lib/media'
import { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native'

const { width } = Dimensions.get('window')

type ApiSlider = {
  id: number
  title?: string
  image: string
  link?: string | null
}

type SliderItem = {
  id: number
  title?: string
  image: string
  link?: string | null
}

export default function HomeSlider() {
  const [data, setData] = useState<SliderItem[]>([])
  const [index, setIndex] = useState(0)
  const ref = useRef<FlatList<SliderItem>>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  /* ===== FETCH ===== */
  useEffect(() => {
    let mounted = true

    getSliders()
      .then((res: any) => {
        const raw = Array.isArray(res) ? res : res?.data ?? []

        const mapped: SliderItem[] = raw
          .filter((item: any) => !!item.image)
          .map((item: any) => ({
            id: item.id,
            title: item.title,
            link: item.link ?? null,
            image: withBaseUrl('/storage/' + item.image)!,
          }))
          
          

        if (mounted) setData(mapped)
      })
      .catch((e) => {
        console.log('SLIDER API ERROR', e)
        if (mounted) setError(true)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  /* ===== AUTO SLIDE ===== */
  useEffect(() => {
    if (!data.length) return

    const t = setInterval(() => {
      const next = (index + 1) % data.length
      ref.current?.scrollToIndex({ index: next, animated: true })
      setIndex(next)
    }, 4000)

    return () => clearInterval(t)
  }, [index, data])

  if (loading) {
    return (
      <View style={{ height: 220, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Slider loading...</Text>
      </View>
    )
  }

  if (error || !data.length) {
    return null // эсвэл placeholder
  }

  return (
    <View>
      <FlatList
        ref={ref}
        data={data}
        keyExtractor={(i) => String(i.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(
            e.nativeEvent.contentOffset.x / width
          )
          setIndex(i)
        }}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />

            {item.title ? (
              <View style={styles.overlay}>
                {/* <Text style={styles.title}>{item.title}</Text> */}
              </View>
            ) : null}
          </View>
        )}
      />

      {/* DOTS */}
      <View style={styles.dots}>
        {data.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === index
                ? styles.dotActive
                : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#eee',
  },
  overlay: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    right: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  dots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#111',
  },
  dotInactive: {
    backgroundColor: '#ccc',
  },
})
