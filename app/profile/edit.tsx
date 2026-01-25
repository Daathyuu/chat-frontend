import { getMe, updateMe, uploadAvatar } from '@/lib/api'
import { withBaseUrl } from '@/lib/media'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Errors = {
    name?: string
    email?: string
}

export default function EditProfile() {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)

    const [avatar, setAvatar] = useState<string | undefined>()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const [errors, setErrors] = useState<Errors>({})

    /* ================= LOAD ME ================= */

    useEffect(() => {
        let mounted = true

            ; (async () => {
                try {
                    const me = await getMe()
                    if (!mounted) return
                    setAvatar(me.avatar)
                    setName(me.name ?? '')
                    setEmail(me.email ?? '')
                } catch (e: any) {
                    Alert.alert('Алдаа', e.message ?? 'Мэдээлэл татаж чадсангүй')
                } finally {
                    if (mounted) setLoading(false)
                }
            })()

        return () => {
            mounted = false
        }
    }, [])

    /* ================= AVATAR PICK & UPLOAD ================= */

    const pickAvatar = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (res.canceled) return

        const asset = res.assets[0]

        try {
            setUploading(true)

            const uploaded = await uploadAvatar({
                uri: asset.uri,
                name: 'avatar.jpg',
                type: 'image/jpeg',
            })

            // backend-с ирсэн avatar path / url
            setAvatar(uploaded.avatar)
        } catch (e: any) {
            Alert.alert('Алдаа', e.message ?? 'Avatar upload алдаа')
        } finally {
            setUploading(false)
        }
    }

    /* ================= SAVE ================= */

    const handleSave = async () => {
        setErrors({})
        setSaving(true)

        try {
            await updateMe({
                name,
                email: email.trim() === '' ? null : email.trim(),
                avatar,
            })

            Alert.alert('Амжилттай', 'Мэдээлэл шинэчлэгдлээ')
            router.back()
        } catch (e: any) {
            if (e?.errors) {
                setErrors({
                    name: e.errors.name?.[0],
                    email: e.errors.email?.[0],
                })
                return
            }

            Alert.alert('Алдаа', e.message ?? 'Хадгалж чадсангүй')
        } finally {
            setSaving(false)
        }
    }

    /* ================= STATES ================= */

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        )
    }

    /* ================= UI ================= */

    return (
        <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} />
                </TouchableOpacity>
                <Text style={styles.title}>Profile засах</Text>
                <View style={{ width: 26 }} />
            </View>

            {/* AVATAR – MAIN FOCUS */}
            <View style={styles.avatarSection}>
                <TouchableOpacity
                    style={styles.avatarWrap}
                    onPress={pickAvatar}
                    activeOpacity={0.85}
                    disabled={uploading}
                >
                    {avatar ? (
                        <Image
                            source={{ uri: withBaseUrl(avatar) }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Ionicons name="person" size={48} color="#fff" />
                        </View>
                    )}

                    {/* CAMERA BADGE */}
                    <View style={styles.cameraBadge}>
                        <Ionicons name="camera" size={16} color="#fff" />
                    </View>
                </TouchableOpacity>

                <Text style={styles.avatarHint}>
                    {uploading ? 'Avatar upload хийж байна…' : 'Avatar солих'}
                </Text>
            </View>

            {/* FORM */}
            <View style={styles.form}>
                <Text style={styles.label}>Нэр</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    style={[
                        styles.input,
                        errors.name && styles.inputError,
                    ]}
                />
                {errors.name && <Text style={styles.error}>{errors.name}</Text>}

                <Text style={styles.label}>Email (заавал биш)</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={[
                        styles.input,
                        errors.email && styles.inputError,
                    ]}
                />
                {errors.email && <Text style={styles.error}>{errors.email}</Text>}
            </View>

            {/* SAVE */}
            <TouchableOpacity
                style={[
                    styles.saveBtn,
                    (saving || uploading) && styles.saveDisabled,
                ]}
                onPress={handleSave}
                disabled={saving || uploading}
            >
                <Text style={styles.saveText}>
                    {saving ? 'Хадгалж байна…' : 'Хадгалах'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
    },

    /* AVATAR */

    avatarSection: {
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 28,
    },

    avatarWrap: {
        position: 'relative',
    },

    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#111',
    },

    avatarPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    cameraBadge: {
        position: 'absolute',
        right: 6,
        bottom: 6,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarHint: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },

    /* FORM */

    form: {},

    label: {
        fontSize: 13,
        color: '#666',
        marginBottom: 6,
    },

    input: {
        height: 44,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 8,
    },

    inputError: {
        borderColor: '#e53935',
    },

    error: {
        fontSize: 12,
        color: '#e53935',
        marginBottom: 12,
    },

    /* SAVE */

    saveBtn: {
        marginTop: 'auto',
        backgroundColor: '#111',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 24,
    },

    saveDisabled: {
        opacity: 0.6,
    },

    saveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
})
