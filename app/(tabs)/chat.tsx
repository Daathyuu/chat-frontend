import ChatListItem, { Chat } from '@/components/chatListItem'
import { getChats, startChatWithUser } from '@/lib/api'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ChatScreen() {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [chats, setChats] = useState<Chat[]>([])
    const [search, setSearch] = useState('')

    const [showModal, setShowModal] = useState(false)
    const [userId, setUserId] = useState('')
    const [loading, setLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
            let mounted = true

                ; (async () => {
                    try {
                        const data = await getChats()

                        if (!mounted) return
                        if (!Array.isArray(data)) return

                        const mapped: Chat[] = data.map((c: any) => ({
                            id: String(c.chat_id),
                            name: c.user?.name ?? 'Unknown',
                            avatar:
                                c.user?.avatar ??
                                `https://i.pravatar.cc/150?u=${c.user?.id}`,
                            lastMessage: c.last_message ?? '',
                            time: c.last_message_at ?? '',
                            unread: 0,
                        }))

                        setChats(mapped)
                    } catch (e: any) {
                        Alert.alert('Алдаа', e?.message ?? 'Chat татаж чадсангүй')
                    }
                })()

            return () => {
                mounted = false
            }
        }, [])
    )

    const filteredChats = useMemo(() => {
        if (!search.trim()) return chats
        return chats.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, chats])

    const handleStartChat = async () => {
        if (!userId.trim()) {
            Alert.alert('Алдаа', 'Хэрэглэгчийн ID оруулна уу')
            return
        }

        try {
            setLoading(true)

            const res = await startChatWithUser(Number(userId))

            setShowModal(false)
            setUserId('')

            router.push({
                pathname: '/chat/[id]',
                params: {
                    id: String(res.chat_id),
                    name: res.name,
                    avatar: res.avatar,

                },
            })
        } catch (e: any) {
            Alert.alert('Алдаа', e?.message ?? 'Chat эхлүүлж чадсангүй')
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>Чатууд</Text>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => setShowModal(true)}
                >
                    <Ionicons name="add" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* SEARCH */}
            <View style={styles.searchWrapper}>
                <TextInput
                    placeholder="Чат хайх"
                    placeholderTextColor="#999"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />
            </View>

            {/* LIST */}
            <FlatList
                style={{ flex: 1 }}
                data={filteredChats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ChatListItem
                        chat={item}
                        onPress={() =>
                            router.push({
                                pathname: '/chat/[id]',
                                params: { id: item.id },
                            })
                        }
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>Чат байхгүй байна</Text>
                }
            />

            {/* MODAL */}
            <Modal transparent visible={showModal} animationType="fade">
                <View style={styles.backdrop}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Шинэ чат</Text>

                        <TextInput
                            placeholder="Хэрэглэгчийн ID"
                            keyboardType="number-pad"
                            value={userId}
                            onChangeText={setUserId}
                            style={styles.modalInput}
                        />

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.cancel}
                                onPress={() => setShowModal(false)}
                            >
                                <Text>Болих</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.confirm}
                                onPress={handleStartChat}
                                disabled={loading}
                            >
                                <Text style={{ color: '#fff' }}>
                                    {loading ? '…' : 'Эхлүүлэх'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    title: { fontSize: 24, fontWeight: '700' },
    addBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchWrapper: { paddingHorizontal: 16 },
    searchInput: {
        height: 40,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    empty: {
        textAlign: 'center',
        marginTop: 40,
        color: '#999',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
    },
    modalTitle: { fontSize: 18, fontWeight: '700' },
    modalInput: {
        marginTop: 12,
        height: 44,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    cancel: {
        padding: 10,
        marginRight: 8,
    },
    confirm: {
        padding: 10,
        backgroundColor: '#111',
        borderRadius: 8,
    },
})
