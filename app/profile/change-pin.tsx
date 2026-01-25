import { changeUserPin } from '@/lib/api'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
    Alert,
    KeyboardAvoidingView, Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Errors = {
    current?: string
    pin?: string
    confirm?: string
}

export default function ChangePinScreen() {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [currentPin, setCurrentPin] = useState('')
    const [pin, setPin] = useState('')
    const [confirm, setConfirm] = useState('')
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Errors>({})

    const handleSave = async () => {
        setErrors({})

        // frontend validation
        if (currentPin.length !== 4) {
            setErrors({ current: 'Одоогийн PIN 4 оронтой' })
            return
        }

        if (pin.length !== 4) {
            setErrors({ pin: 'Шинэ PIN 4 оронтой' })
            return
        }

        if (pin !== confirm) {
            setErrors({ confirm: 'PIN таарахгүй байна' })
            return
        }

        try {
            setSaving(true)

            // 🔐 backend дээр PIN солих
            await changeUserPin({
                current_pin: currentPin,
                pin: pin,
            })

            // 🔒 солисны дараа session дахин lock
            await AsyncStorage.removeItem('pin_unlocked')

            Alert.alert('Амжилттай', 'PIN амжилттай солигдлоо')
            router.replace('/pin')
        } catch (e: any) {
            if (e?.errors) {
                setErrors({
                    current: e.errors.current_pin?.[0],
                    pin: e.errors.new_pin?.[0],
                })
                return
            }

            Alert.alert('Алдаа', e?.message ?? 'PIN солиход алдаа гарлаа')
        } finally {
            setSaving(false)
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={26} />
                    </TouchableOpacity>
                    <Text style={styles.title}>PIN солих</Text>
                    <View style={{ width: 26 }} />
                </View>

                {/* ICON */}
                <View style={styles.iconSection}>
                    <View style={styles.pinCircle}>
                        <Ionicons name="keypad" size={40} color="#fff" />
                    </View>
                    <Text style={styles.hint}>
                        Одоогийн PIN-ээ баталгаажуулаад шинэ PIN тохируулна
                    </Text>
                </View>

                {/* FORM */}
                <View>
                    <Text style={styles.label}>Одоогийн PIN</Text>
                    <TextInput
                        value={currentPin}
                        onChangeText={setCurrentPin}
                        keyboardType="number-pad"
                        secureTextEntry
                        maxLength={4}
                        style={[
                            styles.input,
                            errors.current && styles.inputError,
                        ]}
                    />
                    {errors.current && (
                        <Text style={styles.error}>{errors.current}</Text>
                    )}

                    <Text style={styles.label}>Шинэ PIN</Text>
                    <TextInput
                        value={pin}
                        onChangeText={setPin}
                        keyboardType="number-pad"
                        secureTextEntry
                        maxLength={4}
                        style={[
                            styles.input,
                            errors.pin && styles.inputError,
                        ]}
                    />
                    {errors.pin && <Text style={styles.error}>{errors.pin}</Text>}

                    <Text style={styles.label}>Шинэ PIN (давтах)</Text>
                    <TextInput
                        value={confirm}
                        onChangeText={setConfirm}
                        keyboardType="number-pad"
                        secureTextEntry
                        maxLength={4}
                        style={[
                            styles.input,
                            errors.confirm && styles.inputError,
                        ]}
                    />
                    {errors.confirm && (
                        <Text style={styles.error}>{errors.confirm}</Text>
                    )}
                </View>

                {/* SAVE */}
                <TouchableOpacity
                    style={[
                        styles.saveBtn,
                        saving && styles.saveDisabled,
                    ]}
                    disabled={saving}
                    onPress={handleSave}
                >
                    <Text style={styles.saveText}>
                        {saving ? 'Сольж байна…' : 'PIN солих'}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
        marginBottom: 28,
    },

    pinCircle: {
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
        textAlign: 'center',
        fontSize: 18,
        letterSpacing: 6,
    },

    inputError: {
        borderColor: '#e53935',
    },

    error: {
        fontSize: 12,
        color: '#e53935',
        marginBottom: 12,
    },

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
