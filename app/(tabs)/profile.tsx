import SettingItem from '@/components/settingItem'
import { getMe } from '@/lib/api'
import { withBaseUrl } from '@/lib/media'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type User = {
    id: number
    name: string
    phone: string
    avatar?: string
}

export default function ProfileScreen() {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    useFocusEffect(
        useCallback(() => {
            let mounted = true

                ; (async () => {
                    try {
                        const data = await getMe()
                        if (!mounted) return
                        setUser(data)
                    } catch { }
                })()

            return () => {
                mounted = false
            }
        }, [])
    )
    useEffect(() => {
        let mounted = true

            ; (async () => {
                try {
                    const data = await getMe()
                    if (!mounted) return
                    setUser(data)
                } catch (e: any) {
                    Alert.alert('Алдаа', e.message ?? 'Хэрэглэгчийн мэдээлэл татаж чадсангүй')
                } finally {
                    if (mounted) setLoading(false)
                }
            })()

        return () => {
            mounted = false
        }
    }, [])

    const handleLogout = () => {
        Alert.alert(
            'Гарах',
            'Та системээс гарахдаа итгэлтэй байна уу?',
            [
                { text: 'Болих', style: 'cancel' },
                {
                    text: 'Гарах',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.multiRemove([
                            'token',
                            'invite_verified',
                            'pin_set',
                            'pin',
                            'pin_unlocked',
                        ])
                        router.replace('/login')
                    },
                },
            ]
        )
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{
                paddingTop: insets.top + 16,
                paddingBottom: 32,
            }}
            showsVerticalScrollIndicator={false}
        >
            {/* 👤 HEADER */}
            <View style={styles.header}>
                {user?.avatar ? (
                    <Image source={{ uri: withBaseUrl(user.avatar) }} style={styles.avatarImg} />
                ) : (
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={28} color="#fff" />
                    </View>
                )}

                <Text style={styles.name}>{user?.name ?? ''}</Text>
                <Text style={styles.sub}>{user?.phone ?? ''}</Text>
            </View>

            {/* ⚙️ SETTINGS LIST */}

            <View style={styles.list}>
                <SettingItem
                    icon="create-outline"
                    title="Мэдээлэл засах"
                    subtitle="Хувийн мэдээллээ засах боломжтой"
                    onPress={() => router.push('/profile/edit')}
                />
                <SettingItem
                    icon="lock-closed-outline"
                    title="Нууц үг солих"
                    subtitle="Нэвтрэх үндсэн нууц үг"
                    onPress={() => { router.push('/profile/change-password') }}
                />

                <SettingItem
                    icon="keypad-outline"
                    title="4 оронтой PIN солих"
                    subtitle="Үндсэн хамгаалалт"
                    onPress={() => { router.push('/profile/change-pin') }}
                />

                <SettingItem
                    icon="shield-checkmark-outline"
                    title="Нууцлал & аюулгүй байдал"
                    onPress={() => { router.push('/profile/security') }}
                />

                <SettingItem
                    icon="log-out-outline"
                    title="Гарах"
                    danger
                    onPress={handleLogout}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },

    header: {
        alignItems: 'center',
        marginBottom: 24,
    },

    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },

    avatarImg: {
        width: 72,
        height: 72,
        borderRadius: 36,
        marginBottom: 12,
    },

    name: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111',
    },

    sub: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },

    list: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
