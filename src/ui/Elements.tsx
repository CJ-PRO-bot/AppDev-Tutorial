import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../state/AppState';

export function Page({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const { colors } = useApp();
  return <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
    {scroll ? <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{children}</ScrollView>
      : <View style={[styles.page, { flex: 1 }]}>{children}</View>}
  </SafeAreaView>;
}
export function Txt({ children, size = 15, weight = 'normal', muted = false, style }: {
  children: React.ReactNode; size?: number; weight?: 'normal' | 'medium' | 'semibold' | 'bold'; muted?: boolean;
  style?: StyleProp<any>;
}) {
  const { colors } = useApp();
  const fontWeight = weight === 'normal' ? '400' : weight === 'medium' ? '500' : weight === 'semibold' ? '600' : '700';
  return <Text style={[{ color: muted ? colors.muted : colors.text, fontSize: size, fontWeight, lineHeight: size * 1.4 }, style]}>{children}</Text>;
}
export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors } = useApp();
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>{children}</View>;
}
export function Button({ title, onPress, secondary = false, danger = false, disabled = false, icon, compact = false }: {
  title: string; onPress: () => void; secondary?: boolean; danger?: boolean; disabled?: boolean; icon?: string; compact?: boolean;
}) {
  const { colors } = useApp();
  const bg = secondary ? colors.tint : danger ? colors.danger : colors.primary;
  const fg = secondary ? colors.primary : '#FFFFFF';
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({pressed}) => ({
    backgroundColor: bg, paddingHorizontal: compact ? 14 : 20, paddingVertical: compact ? 10 : 14,
    borderRadius: 13, opacity: disabled ? .45 : pressed ? .75 : 1,
    flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center',
  })}>
    {icon ? <Ionicons name={icon as any} size={18} color={fg} /> : null}
    <Text style={{ fontSize: compact ? 13 : 15, fontWeight: '700', color: fg }}>{title}</Text>
  </Pressable>;
}
export function IconButton({ icon, onPress, active = false, label }: { icon: string; onPress: () => void; active?: boolean; label: string }) {
  const { colors } = useApp();
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({pressed}) => ({
    borderRadius: 12, padding: 10, backgroundColor: active ? colors.tint : colors.soft, opacity: pressed ? .7 : 1,
  })}><Ionicons name={icon as any} size={21} color={active ? colors.primary : colors.text} /></Pressable>;
}
export function SectionTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 13 }}>
    <View style={{ flex: 1, paddingRight: 8 }}><Txt size={19} weight="bold">{title}</Txt>{subtitle && <Txt size={13} muted>{subtitle}</Txt>}</View>{right}
  </View>;
}
export function ProgressBar({ progress, height = 8, color }: { progress: number; height?: number; color?: string }) {
  const { colors } = useApp();
  const fraction = Math.max(0, Math.min(100, progress));
  return <View style={{ height, backgroundColor: colors.soft, borderRadius: 999, overflow: 'hidden' }}>
    <View style={{ height, width: `${fraction}%`, backgroundColor: color || colors.primary, borderRadius: 999 }} />
  </View>;
}
export function Tag({ text, accent }: { text: string; accent?: boolean }) {
  const { colors } = useApp();
  return <View style={{ paddingVertical: 5, paddingHorizontal: 9, backgroundColor: accent ? colors.tint : colors.soft, borderRadius: 999, alignSelf: 'flex-start' }}>
    <Txt size={11} weight="semibold" style={{ color: accent ? colors.primary : colors.muted }}>{text}</Txt>
  </View>;
}
const styles = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 15, width: '100%', maxWidth: 850, alignSelf: 'center' },
  card: { borderWidth: 1, borderRadius: 18, padding: 17, marginBottom: 12 },
});
