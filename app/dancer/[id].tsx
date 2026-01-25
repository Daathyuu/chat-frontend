import { getDancer, startChatWithUser } from '@/lib/api'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
/* ================= TYPES ================= */

type Media = {
    type: 'image' | 'video'
    url: string
}

type Dancer = {
    id: number
    name: string
    avatar?: string
    media?: Media[]
}

/* ================= CONST ================= */

const { width } = Dimensions.get('window')
const HERO_HEIGHT = Math.round(width * 1.25)

/* ================= SCREEN ================= */

export default function DancerProfile() {
    const { id } = useLocalSearchParams<{ id?: string }>()
    const router = useRouter()
    const insets = useSafeAreaInsets()

    const [dancer, setDancer] = useState<Dancer | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return
        let mounted = true

            ; (async () => {
                try {
                    const data = await getDancer(id)
                    if (!mounted) return
                    setDancer(data)
                    setSelectedImage(data.avatar ?? null)
                } catch {
                    setDancer(null)
                } finally {
                    if (mounted) setLoading(false)
                }
            })()

        return () => {
            mounted = false
        }
    }, [id])

    /* ================= STATES ================= */

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (!dancer) {
        return (
            <View style={styles.center}>
                <Text style={{ fontSize: 16 }}>Profile олдсонгүй</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ marginTop: 12, color: '#007AFF' }}>
                        Буцах
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    const images: string[] = [
        dancer.avatar,
        ...(dancer.media
            ?.filter(m => m.type === 'image')
            .map(m => m.url) || []),
    ].filter((i): i is string => Boolean(i))

    /* ================= UI ================= */

    return (
        <View style={styles.root}>
            {/* HERO IMAGE */}
            {selectedImage && (
                <Image source={{ uri: selectedImage }} style={styles.hero} />
            )}

            {/* DARK GRADIENT OVERLAY */}
            <View style={styles.heroOverlay} />

            {/* BACK */}
            <TouchableOpacity
                style={[styles.backBtn, { top: insets.top + 10 }]}
                onPress={() => router.back()}
            >
                <Ionicons name="chevron-back" size={26} color="#fff" />
            </TouchableOpacity>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* SPACER FOR HERO */}
                <View style={{ height: HERO_HEIGHT - 60 }} />

                {/* CONTENT CARD */}
                <View style={styles.card}>
                    <Text style={styles.name}>{dancer.name}</Text>

                    {/* GALLERY */}
                    {images.length > 1 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.gallery}
                        >
                            {images.map((img, i) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => setSelectedImage(img)}
                                >
                                    <Image source={{ uri: img }} style={styles.thumb} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    {/* ACTION */}
                    <TouchableOpacity
                        style={styles.chatBtn}
                        onPress={async () => {
                            try {
                                const res = await startChatWithUser(dancer.id)

                                router.push({
                                    pathname: '/chat/[id]',
                                    params: { id: String(res.chat_id) },
                                })
                            } catch (e: any) {
                                alert(e.message ?? 'Chat эхлүүлж чадсангүй')
                            }
                        }}
                    >
                        <Ionicons name="chatbubble-ellipses" size={18} color="#fff" />
                        <Text style={styles.chatText}>Chat эхлүүлэх</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#000',
    },

    hero: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: HERO_HEIGHT,
        resizeMode: 'cover',
    },

    heroOverlay: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: HERO_HEIGHT,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },

    backBtn: {
        position: 'absolute',
        left: 16,
        zIndex: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 22,
        padding: 6,
    },

    card: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 24,
        paddingBottom: 28,
        paddingHorizontal: 20,
        minHeight: 300,
    },

    name: {
        fontSize: 26,
        fontWeight: '800',
        color: '#111',
        marginBottom: 16,
    },

    gallery: {
        marginBottom: 24,
    },

    thumb: {
        width: 90,
        height: 120,
        borderRadius: 14,
        marginRight: 12,
    },

    chatBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111',
        borderRadius: 18,
        paddingVertical: 16,
    },

    chatText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
