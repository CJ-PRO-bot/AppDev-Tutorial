import React, { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { categories, getCategory, lessons, lessonsIn, type Lesson } from '../data/curriculum';
import { useApp } from '../state/AppState';
import { Page, Button, Card, IconButton, ProgressBar, SectionTitle, Tag, Txt } from '../ui/Elements';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;
function Greeting({ label, title, description }: { label: string; title: string; description?: string }) {
  const { colors } = useApp();
  return <View style={{ marginBottom: 22 }}>
    <Txt size={12} weight="bold" style={{ color: colors.primary, letterSpacing: 1.2 }}>{label.toUpperCase()}</Txt>
    <Txt size={27} weight="bold" style={{ marginTop: 5 }}>{title}</Txt>
    {description && <Txt muted style={{ marginTop: 5 }}>{description}</Txt>}
  </View>;
}
function LessonRow({ lesson, trail = false }: { lesson: Lesson; trail?: boolean }) {
  const nav = useNavigation<Nav>();
  const { colors, progress, toggleBookmark } = useApp();
  const done = progress.completed.includes(lesson.id);
  const bookmarked = progress.bookmarks.includes(lesson.id);
  const category = getCategory(lesson.categoryId);
  return <Card style={{ padding: 0, overflow: 'hidden' }}>
    <Pressable onPress={() => nav.navigate('Lesson', { id: lesson.id })} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 11, padding: 15 }}>
      <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: done ? colors.successTint : colors.tint, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={done ? 'checkmark-done' : category.icon as any} size={22} color={done ? colors.success : category.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Txt size={15} weight="semibold">{lesson.title}</Txt>
        <Txt size={12} muted>{trail ? category.name + ' · ' : ''}{lesson.minutes} min · {lesson.level}{done ? ' · Completed' : ''}</Txt>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'} onPress={() => toggleBookmark(lesson.id)} hitSlop={12} style={{ padding: 5 }}>
        <Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={20} color={bookmarked ? colors.primary : colors.muted} />
      </Pressable>
      <Ionicons name="chevron-forward" size={15} color={colors.muted} />
    </Pressable>
  </Card>;
}

export function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { colors, progress } = useApp();
  const pct = Math.round(progress.completed.length / lessons.length * 100);
  const next = lessons.find(lesson => !progress.completed.includes(lesson.id)) || lessons[0];
  const finishedQuiz = Object.keys(progress.quizzes).length;
  return <Page>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View><Txt size={13} muted>Good to see you 👋</Txt><Txt size={25} weight="bold">{progress.name || 'Future developer'}</Txt></View>
      <View style={{ padding: 11, borderRadius: 15, backgroundColor: colors.tint }}><Ionicons name="code-slash" color={colors.primary} size={26} /></View>
    </View>
    <Card style={{ backgroundColor: colors.primaryDeep, borderWidth: 0, padding: 21, marginTop: 22 }}>
      <TextOnPurple label="YOUR LEARNING JOURNEY" size={11} />
      <TextOnPurple label="Build skills, one lesson at a time." size={23} bold style={{ marginTop: 10, marginBottom: 12 }} />
      <TextOnPurple label={`${progress.completed.length} of ${lessons.length} lessons completed`} size={13} />
      <View style={{ marginTop: 12, backgroundColor: 'rgba(255,255,255,.25)', height: 9, borderRadius: 10, overflow: 'hidden' }}>
        <View style={{ width: `${pct}%`, height: '100%', backgroundColor: '#FFFFFF', borderRadius: 10 }} />
      </View>
      <TextOnPurple label={`${pct}% complete`} size={12} style={{ textAlign: 'right', marginTop: 7 }} />
    </Card>
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {[
        { icon: 'book-outline', value: progress.completed.length, label: 'Lessons done' },
        { icon: 'help-circle-outline', value: finishedQuiz, label: 'Quizzes taken' },
        { icon: 'checkmark-circle-outline', value: progress.practices.length, label: 'Tasks done' },
      ].map(item => <View key={item.label} style={{ flex: 1, padding: 12, borderRadius: 15, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}>
        <Ionicons name={item.icon as any} size={20} color={colors.primary} />
        <Txt size={21} weight="bold" style={{ marginTop: 6 }}>{item.value}</Txt>
        <Txt size={10} muted style={{ textAlign: 'center' }}>{item.label}</Txt>
      </View>)}
    </View>
    <SectionTitle title={pct === 100 ? 'Review a lesson' : 'Continue learning'} subtitle="Recommended next step" />
    <Card>
      <Tag text={`${getCategory(next.categoryId).name} · ${next.level}`} accent />
      <Txt size={19} weight="bold" style={{ marginTop: 11 }}>{next.title}</Txt>
      <Txt muted style={{ marginTop: 4, marginBottom: 17 }}>{next.summary}</Txt>
      <Button title="Open lesson" icon="arrow-forward" onPress={() => nav.navigate('Lesson', { id: next.id })} />
    </Card>
    <SectionTitle title="Guided learning paths" subtitle="Follow the modules in order" />
    {categories.map(category => <PathCard key={category.id} categoryId={category.id} onPress={() => {
      const inPath = lessonsIn(category.id);
      const recommended = inPath.find(item => !progress.completed.includes(item.id)) || inPath[0];
      nav.navigate('Lesson', { id: recommended.id });
    }} />)}
  </Page>;
}
function TextOnPurple({ label, size = 14, bold, style }: { label: string; size?: number; bold?: boolean; style?: any }) {
  return <Txt size={size} weight={bold ? 'bold' : 'normal'} style={[{ color: 'white' }, style]}>{label}</Txt>;
}
function PathCard({ categoryId, onPress }: { categoryId: typeof categories[number]['id']; onPress?: () => void }) {
  const { colors, progress } = useApp();
  const category = getCategory(categoryId);
  const items = lessonsIn(categoryId);
  const completed = items.filter(item => progress.completed.includes(item.id)).length;
  return <Pressable accessibilityRole="button" onPress={onPress} style={({pressed}) => ({ opacity: pressed ? .75 : 1 })}>
    <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
      <View style={{ padding: 12, borderRadius: 13, backgroundColor: colors.soft }}><Ionicons name={category.icon as any} size={25} color={category.accent} /></View>
      <View style={{ flex: 1 }}><Txt size={16} weight="semibold">{category.name}</Txt><Txt size={12} muted>{category.subtitle}</Txt>
        <View style={{ marginTop: 10 }}><ProgressBar progress={completed/items.length*100} height={6} color={category.accent} /></View></View>
      <Txt size={12} muted>{completed}/{items.length}</Txt>
    </Card>
  </Pressable>;
}

export function LearnScreen() {
  const { colors, progress } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(() => lessons.filter(lesson => (filter === 'all' || lesson.categoryId === filter)
    && `${lesson.title} ${lesson.summary} ${getCategory(lesson.categoryId).name}`.toLowerCase().includes(search.trim().toLowerCase())), [search, filter]);
  return <Page>
    <Greeting label="Your curriculum" title="Explore tutorials" description="Short lessons with code, quizzes and practice." />
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 13, marginBottom: 15 }}>
      <Ionicons name="search" size={20} color={colors.muted} />
      <TextInput value={search} onChangeText={setSearch} placeholder="Search topics or skills..." placeholderTextColor={colors.muted} style={{ flex: 1, padding: 13, color: colors.text, fontSize: 14 }} />
      {search && <Pressable accessibilityLabel="Clear search" accessibilityRole="button" onPress={() => setSearch('')}><Ionicons name="close-circle" color={colors.muted} size={20} /></Pressable>}
    </View>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
      {[{ id: 'all', name: 'All' }, ...categories].map(cat => <Pressable key={cat.id} accessibilityRole="button" onPress={() => setFilter(cat.id)} style={{ backgroundColor: filter === cat.id ? colors.primary : colors.card, borderColor: filter === cat.id ? colors.primary : colors.border, borderWidth: 1, borderRadius: 30, paddingVertical: 8, paddingHorizontal: 13 }}>
        <Txt size={12} weight="semibold" style={{ color: filter === cat.id ? '#FFFFFF' : colors.muted }}>{cat.name}</Txt>
      </Pressable>)}
    </View>
    <Txt size={13} muted style={{ marginBottom: 13 }}>{filtered.length} lessons · {progress.completed.length} completed overall</Txt>
    {filtered.map(lesson => <LessonRow key={lesson.id} lesson={lesson} trail />)}
    {filtered.length === 0 && <Card><Txt muted>No matching tutorials. Try a different search.</Txt></Card>}
  </Page>;
}
export function SavedScreen() {
  const { progress } = useApp();
  const saved = lessons.filter(lesson => progress.bookmarks.includes(lesson.id));
  return <Page>
    <Greeting label="Your collection" title="Saved lessons" description="Quick access to your bookmarked lessons." />
    {saved.length ? saved.map(lesson => <LessonRow key={lesson.id} lesson={lesson} trail />) : <Card style={{ alignItems: 'center', paddingVertical: 36 }}>
      <Ionicons name="bookmark-outline" color="#918DE0" size={46} /><Txt size={18} weight="bold" style={{ marginTop: 10 }}>Nothing saved yet</Txt>
      <Txt muted style={{ textAlign: 'center', marginTop: 6 }}>Open any lesson and tap the bookmark icon to save it here.</Txt>
    </Card>}
  </Page>;
}
function streakCount(days: string[]): number {
  const set = new Set(days);
  const cursor = new Date();
  const key = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  if (!set.has(key(cursor))) cursor.setDate(cursor.getDate()-1);
  let n = 0;
  while (set.has(key(cursor))) { n++; cursor.setDate(cursor.getDate()-1); }
  return n;
}
export function ProgressScreen() {
  const { colors, progress } = useApp();
  const results = Object.values(progress.quizzes);
  const average = results.length ? Math.round(results.reduce((sum, q) => sum + q.score / q.total * 100, 0) / results.length) : 0;
  const completion = Math.round(progress.completed.length / lessons.length * 100);
  return <Page>
    <Greeting label="Keep growing" title="Learning progress" description="See what you have learned and what comes next." />
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View><Txt size={13} muted>Overall completion</Txt><Txt size={32} weight="bold">{completion}%</Txt></View>
        <Ionicons name="trophy-outline" size={38} color={colors.primary} />
      </View>
      <View style={{ marginTop: 12 }}><ProgressBar progress={completion} height={10} /></View>
      <Txt size={12} muted style={{ marginTop: 10 }}>{progress.completed.length} / {lessons.length} tutorials completed</Txt>
    </Card>
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {[
        { label: 'Study streak', value: `${streakCount(progress.studyDays)} day(s)`, icon: 'flame-outline' },
        { label: 'Avg. quiz score', value: results.length ? `${average}%` : '—', icon: 'ribbon-outline' },
      ].map(item => <View key={item.label} style={{ flex: 1 }}><Card>
        <Ionicons name={item.icon as any} color={colors.primary} size={23} /><Txt size={20} weight="bold" style={{ marginTop: 8 }}>{item.value}</Txt><Txt size={12} muted>{item.label}</Txt>
      </Card></View>)}
    </View>
    <SectionTitle title="Path completion" subtitle="Your progress by category" />
    {categories.map(cat => {
      const items = lessonsIn(cat.id);
      const completed = items.filter(item => progress.completed.includes(item.id)).length;
      return <Card key={cat.id}><View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}><Txt weight="semibold">{cat.name}</Txt><Txt muted size={12}>{completed}/{items.length}</Txt></View><ProgressBar progress={completed / items.length * 100} color={cat.accent} /></Card>;
    })}
    <SectionTitle title="Quiz results" subtitle="Most recent attempt for each lesson" />
    {results.length ? lessons.filter(lesson => !!progress.quizzes[lesson.id]).map(lesson => {
      const result = progress.quizzes[lesson.id];
      return <Card key={lesson.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1, paddingRight: 12 }}><Txt weight="semibold">{lesson.title}</Txt><Txt size={12} muted>Last attempt · {result.score} of {result.total}</Txt></View>
        <Tag text={`${Math.round(result.score / result.total * 100)}%`} accent />
      </Card>;
    }) : <Card><Txt muted>Finish a quiz to see your score here.</Txt></Card>}
    <SectionTitle title="Practice activities" />
    <Card><Txt size={14} muted>{progress.practices.length} of {lessons.length} lesson exercises marked complete.</Txt><View style={{ marginTop: 11 }}><ProgressBar progress={progress.practices.length / lessons.length * 100} /></View></Card>
  </Page>;
}

const hourOptions = [7, 9, 12, 18, 20, 21];
const readableHour = (h: number) => `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`;
async function scheduleReminder(hour: number): Promise<void> {
  if (Platform.OS === 'web') throw new Error('Daily device notifications are available in the Android/iOS app, not in the web preview.');
  const Notifications = await import('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
  });
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('study-reminders', { name: 'Study reminders', importance: Notifications.AndroidImportance.DEFAULT });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') throw new Error('Notifications permission was not granted. Enable it in phone settings and try again.');
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Your AppDev study session 📱', body: 'Time to learn something new. Open a lesson and keep your streak growing!' },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute: 0, ...(Platform.OS === 'android' ? { channelId: 'study-reminders' } : {}) },
  });
}
async function cancelReminder() {
  if (Platform.OS === 'web') return;
  const Notifications = await import('expo-notifications');
  await Notifications.cancelAllScheduledNotificationsAsync();
}
export function ProfileScreen() {
  const { colors, progress, session, user, firebaseEnabled, setColorMode, setDisplayName, setReminder, resetLearning, logout, showLogin } = useApp();
  const [name, setName] = useState(progress.name);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const changeReminder = async (enable: boolean, hour: number) => {
    setBusy(true); setMessage('');
    try {
      if (enable) await scheduleReminder(hour);
      else await cancelReminder();
      setReminder(enable, hour);
      setMessage(enable ? `Reminder set for ${readableHour(hour)} every day.` : 'Daily reminders turned off.');
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Could not set reminder'); }
    finally { setBusy(false); }
  };
  const doReset = () => {
    const act = () => { resetLearning(); setMessage('Lesson, quiz, practice and bookmark progress cleared.'); };
    if (Platform.OS === 'web') { if (globalThis.confirm('Reset all learning progress? This cannot be undone.')) act(); }
    else Alert.alert('Reset progress?', 'This clears finished lessons, bookmarks, quiz scores and practice records.', [{ text: 'Cancel' }, { text: 'Reset', style: 'destructive', onPress: act }]);
  };
  return <Page>
    <Greeting label="Make it yours" title="Profile & settings" description="Manage learning preferences and reminders." />
    <Card>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 15 }}>
        <View style={{ backgroundColor: colors.tint, padding: 13, borderRadius: 15 }}><Ionicons name="person-outline" size={26} color={colors.primary} /></View>
        <View style={{ flex: 1 }}><Txt weight="bold" size={16}>{progress.name || 'Developer in training'}</Txt><Txt muted size={12}>{session === 'cloud' ? (user?.email || 'Firebase learner') : 'Guest · On-device data'}</Txt></View>
      </View>
      <Txt weight="semibold" size={13} style={{ marginBottom: 8 }}>Display name</Txt>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <TextInput value={name} onChangeText={setName} maxLength={50} placeholder="Your name" placeholderTextColor={colors.muted} style={{ color: colors.text, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 11, flex: 1 }} />
        <Button title="Save" compact onPress={() => {setDisplayName(name); setMessage('Name saved.');}} />
      </View>
    </Card>
    <SectionTitle title="Appearance" />
    <Card><Txt size={13} muted style={{ marginBottom: 12 }}>Choose your preferred display mode.</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {(['system', 'light', 'dark'] as const).map(mode => <Pressable key={mode} accessibilityRole="button" onPress={() => setColorMode(mode)} style={{ paddingVertical: 11, paddingHorizontal: 17, borderRadius: 11, borderWidth: 1, borderColor: progress.theme === mode ? colors.primary : colors.border, backgroundColor: progress.theme === mode ? colors.tint : colors.bg }}>
          <Txt weight="semibold" size={13} style={{ color: progress.theme === mode ? colors.primary : colors.text }}>{mode[0].toUpperCase() + mode.slice(1)}</Txt>
        </Pressable>)}
      </View>
    </Card>
    <SectionTitle title="Daily study reminder" subtitle="Local device notifications" />
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15 }}><Ionicons name="notifications-outline" size={25} color={colors.primary} />
        <View style={{ flex: 1 }}><Txt weight="semibold">Remind me to learn</Txt><Txt size={12} muted>{progress.reminderEnabled ? `Enabled · ${readableHour(progress.reminderHour)}` : 'Currently off'}</Txt></View>
        <Button title={progress.reminderEnabled ? 'Turn off' : 'Enable'} compact secondary={progress.reminderEnabled} disabled={busy} onPress={() => {void changeReminder(!progress.reminderEnabled, progress.reminderHour);}} />
      </View>
      <Txt size={12} muted style={{ marginBottom: 9 }}>Choose a daily notification time:</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {hourOptions.map(hour => <Pressable key={hour} disabled={busy} accessibilityRole="button" onPress={() => {if (progress.reminderEnabled) void changeReminder(true, hour); else setReminder(false, hour);}} style={{ padding: 9, borderRadius: 10, borderWidth: 1, borderColor: progress.reminderHour === hour ? colors.primary : colors.border, backgroundColor: progress.reminderHour === hour ? colors.tint : colors.bg }}>
          <Txt size={12} weight="semibold" style={{ color: progress.reminderHour === hour ? colors.primary : colors.text }}>{readableHour(hour)}</Txt>
        </Pressable>)}
      </View>
      <Txt size={12} muted style={{ marginTop: 12 }}>Requires notification permission on a phone. Web preview cannot schedule phone alerts.</Txt>
    </Card>
    {message ? <Card style={{ backgroundColor: colors.tint }}><Txt size={13}>{message}</Txt></Card> : null}
    <SectionTitle title="Your account & data" />
    <Card>
      <Txt weight="semibold">{session === 'cloud' ? 'Firebase account' : 'Local guest profile'}</Txt>
      <Txt size={13} muted style={{ marginTop: 5, marginBottom: 13 }}>{session === 'cloud' ? 'Your records are saved in your Firestore learner document.' : 'Progress is stored only on this device/browser. It will not sync to other devices.'}</Txt>
      {session === 'guest' && firebaseEnabled && <Button title="Sign in to sync" secondary onPress={() => { void showLogin(); }} />}
      {session === 'cloud' && <Button title="Sign out" secondary onPress={() => { void logout(); }} />}
    </Card>
    <Card><Txt weight="semibold" style={{ marginBottom: 7 }}>Start fresh</Txt><Txt size={13} muted style={{ marginBottom: 13 }}>Erase saved lessons, completed tasks and quiz scores in the current profile.</Txt><Button title="Reset learning progress" danger onPress={doReset} /></Card>
    <Txt size={12} muted style={{ textAlign: 'center', marginTop: 15 }}>AppDev Tutorial · CTE308 Project II · CST, RUB</Txt>
  </Page>;
}
