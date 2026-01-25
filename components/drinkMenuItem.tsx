import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DrinkSetCard({ item }: any) {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.wrapper}>
            {/* HEADER */}
            <TouchableOpacity
                activeOpacity={0.85}
                style={[
                    styles.card,
                    open && styles.cardOpen,
                ]}
                onPress={() => setOpen(!open)}
            >
                <View>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.desc}>{item.desc}</Text>
                </View>

                <View style={styles.right}>
                    <Text style={styles.price}>{item.price}</Text>
                    <Ionicons
                        name={open ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#666"
                    />
                </View>
            </TouchableOpacity>

            {/* EXPANDED CONTENT */}
            {open && (
                <View style={styles.expand}>
                    <Text style={styles.includes}>Дагалдах уух зүйлс</Text>

                    {item.items.map((drink: string, i: number) => (
                        <Text key={i} style={styles.item}>
                            • {drink}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 14,
    },

    card: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 2,
    },

    cardOpen: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },

    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
    },

    desc: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },

    right: {
        alignItems: 'flex-end',
    },

    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
        marginBottom: 4,
    },

    expand: {
        backgroundColor: '#f4f4f4',
        marginHorizontal: 16,
        padding: 14,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },

    includes: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 6,
        color: '#111',
    },

    item: {
        fontSize: 13,
        color: '#333',
        marginBottom: 4,
    },
});
