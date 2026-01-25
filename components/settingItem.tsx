import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingItem({
    icon,
    title,
    subtitle,
    onPress,
    danger = false,
}: any) {
    return (
        <TouchableOpacity
            style={styles.item}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.left}>
                <Ionicons
                    name={icon}
                    size={20}
                    color={danger ? '#E53935' : '#111'}
                />

                <View style={styles.textWrap}>
                    <Text
                        style={[
                            styles.title,
                            danger && { color: '#E53935' },
                        ]}
                    >
                        {title}
                    </Text>

                    {subtitle && (
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    )}
                </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },

    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    textWrap: {
        marginLeft: 12,
    },

    title: {
        fontSize: 15,
        color: '#111',
    },

    subtitle: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
});
