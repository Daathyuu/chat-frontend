import { updatePassword } from '@/lib/api'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Errors = {
    current?: string
    password?: string
    password_confirmation?: string
}

export default function ChangePassword() {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [currentPassword, setCurrentPassword] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Errors>({})

    const handleSave = async () => {
        setErrors({})

        // frontend validation (light)
        if (!currentPassword) {
            setErrors({ current: 'Одоогийн нууц үгээ оруулна уу' })
            return
        }

        if (password.length < 6) {
            setErrors({ password: 'Нууц үг хамгийн багадаа 6 тэмдэгт' })
            return
        }

        if (password !== confirm) {
            setErrors({
                password_confirmation: 'Нууц үг таарахгүй байна',
            })
            return
        }

        try {
            setSaving(true)

            await updatePassword({
                current_password: currentPassword,
                password,
                password_confirmation: confirm,
            })

            Alert.alert('Амжилттай', 'Нууц үг солигдлоо')
            router.back()
        } catch (e: any) {
            // backend validation
            if (e?.errors) {
                setErrors({
                    current: e.errors.current_password?.[0],
                    password: e.errors.password?.[0],
                    password_confirmation:
                        e.errors.password_confirmation?.[0],
                })
                return
            }

            Alert.alert('Алдаа', e.message ?? 'Солиход алдаа гарлаа')
        } finally {
            setSaving(false)
        }
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={26} />
                </TouchableOpacity>
                <Text style={styles.title}>Нууц үг солих</Text>
                <View style={{ width: 26 }} />
            </View>

            {/* ICON SECTION (avatar-тай адил гол визуал) */}
            <View style={styles.iconSection}>
                <View style={styles.lockCircle}>
                    <Ionicons name="lock-closed" size={42} color="#fff" />
                </View>
                <Text style={styles.hint}>
                    Аюулгүй байдлын үүднээс нууц үгээ тогтмол солиорой
                </Text>
            </View>

            {/* FORM */}
            <View>
                <Text style={styles.label}>Одоогийн нууц үг</Text>
                <TextInput
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    style={[
                        styles.input,
                        errors.current && styles.inputError,
                    ]}
                />
                {errors.current && (
                    <Text style={styles.error}>{errors.current}</Text>
                )}

                <Text style={styles.label}>Шинэ нууц үг</Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={[
                        styles.input,
                        errors.password && styles.inputError,
                    ]}
                />
                {errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                )}

                <Text style={styles.label}>Шинэ нууц үг (дахин)</Text>
                <TextInput
                    value={confirm}
                    onChangeText={setConfirm}
                    secureTextEntry
                    style={[
                        styles.input,
                        errors.password_confirmation &&
                        styles.inputError,
                    ]}
                />
                {errors.password_confirmation && (
                    <Text style={styles.error}>
                        {errors.password_confirmation}
                    </Text>
                )}
            </View>

            {/* SAVE */}
            <TouchableOpacity
                style={[
                    styles.saveBtn,
                    saving && styles.saveDisabled,
                ]}
                onPress={handleSave}
                disabled={saving}
            >
                <Text style={styles.saveText}>
                    {saving ? 'Сольж байна…' : 'Нууц үг солих'}
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

    /* ICON */

    iconSection: {
        alignItems: 'center',
        marginBottom: 28,
    },

    lockCircle: {
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

    /* FORM */

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
