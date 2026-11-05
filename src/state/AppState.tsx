import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, firebaseEnabled } from '../services/firebase';
import { darkColors, lightColors, type Palette } from '../ui/theme';

export type ColorMode = 'system' | 'light' | 'dark';
export type QuizResult = { score: number; total: number; answers: number[]; completedAt: string };
export type LearnerProgress = {
  completed: string[];
  bookmarks: string[];
  practices: string[];
  quizzes: Record<string, QuizResult>;
  studyDays: string[];
  name: string;
  theme: ColorMode;
  reminderEnabled: boolean;
  reminderHour: number;
};

export const blankProgress: LearnerProgress = {
  completed: [], bookmarks: [], practices: [], quizzes: {}, studyDays: [],
  name: '', theme: 'system', reminderEnabled: false, reminderHour: 20,
};

const GUEST_DATA_KEY = '@appdev_tutorial/guest_progress_v1';
const GUEST_ACTIVE_KEY = '@appdev_tutorial/guest_active';
export type Session = 'guest' | 'cloud' | null;

function validProgress(raw: unknown): LearnerProgress {
  if (!raw || typeof raw !== 'object') return { ...blankProgress };
  const o = raw as Partial<LearnerProgress>;
  return {
    completed: Array.isArray(o.completed) ? o.completed : [],
    bookmarks: Array.isArray(o.bookmarks) ? o.bookmarks : [],
    practices: Array.isArray(o.practices) ? o.practices : [],
    quizzes: o.quizzes && typeof o.quizzes === 'object' && !Array.isArray(o.quizzes) ? o.quizzes : {},
    studyDays: Array.isArray(o.studyDays) ? o.studyDays : [],
    name: typeof o.name === 'string' ? o.name : '',
    theme: o.theme === 'light' || o.theme === 'dark' ? o.theme : 'system',
    reminderEnabled: typeof o.reminderEnabled === 'boolean' ? o.reminderEnabled : false,
    reminderHour: Number.isInteger(o.reminderHour) && (o.reminderHour ?? 20) >= 0 && (o.reminderHour ?? 20) <= 23 ? o.reminderHour! : 20,
  };
}
function dayKey(): string {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
}

interface AppContextValue {
  session: Session; firebaseEnabled: boolean; user: User | null; loading: boolean;
  colors: Palette; isDark: boolean; progress: LearnerProgress;
  startGuest: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  showLogin: () => Promise<void>;
  completeLesson: (id: string) => void;
  toggleBookmark: (id: string) => void;
  togglePractice: (id: string) => void;
  recordQuiz: (id: string, answers: number[], score: number, total: number) => void;
  setColorMode: (value: ColorMode) => void;
  setReminder: (enabled: boolean, hour: number) => void;
  setDisplayName: (name: string) => void;
  resetLearning: () => void;
}
const AppContext = createContext<AppContextValue | undefined>(undefined);
export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppProvider must wrap the application');
  return ctx;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemColor = useColorScheme();
  const [session, setSession] = useState<Session>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<LearnerProgress>({ ...blankProgress });
  const progressRef = useRef<LearnerProgress>({ ...blankProgress });
  const identityRef = useRef<{ session: Session; uid: string | null }>({ session: null, uid: null });
  const loadToken = useRef(0);
  const pendingSave = useRef<Promise<unknown>>(Promise.resolve());

  async function loadGuest(): Promise<void> {
    const token = ++loadToken.current;
    setLoading(true);
    const raw = await AsyncStorage.getItem(GUEST_DATA_KEY).catch(() => null);
    if (token !== loadToken.current) return;
    const next = raw ? safeParse(raw) : { ...blankProgress };
    progressRef.current = next;
    identityRef.current = { session: 'guest', uid: null };
    setProgress(next);
    setUser(null);
    setSession('guest');
    setLoading(false);
  }

  useEffect(() => {
    if (!auth) {
      // Show the welcome screen on first launch; return directly to saved guest progress later.
      void AsyncStorage.getItem(GUEST_ACTIVE_KEY)
        .then(active => { if (active === 'true') return loadGuest(); setLoading(false); })
        .catch(() => setLoading(false));
      return;
    }
    return onAuthStateChanged(auth, async currentUser => {
      const token = ++loadToken.current;
      setLoading(true);
      if (currentUser && db) {
        const cloudDb = db;
        let next = { ...blankProgress };
        try {
          const snapshot = await getDoc(doc(cloudDb, 'users', currentUser.uid, 'data', 'progress'));
          if (snapshot.exists()) next = validProgress(snapshot.data());
        } catch (error) {
          // The app still opens if Firestore is temporarily unavailable.
          console.warn('Could not load cloud progress. Check your Firestore rules/connection.', error);
        }
        if (token !== loadToken.current) return;
        progressRef.current = next;
        identityRef.current = { session: 'cloud', uid: currentUser.uid };
        setProgress(next);
        setUser(currentUser);
        setSession('cloud');
      } else {
        const activeGuest = await AsyncStorage.getItem(GUEST_ACTIVE_KEY).catch(() => null);
        if (token !== loadToken.current) return;
        if (activeGuest === 'true') {
          const raw = await AsyncStorage.getItem(GUEST_DATA_KEY).catch(() => null);
          if (token !== loadToken.current) return;
          const next = raw ? safeParse(raw) : { ...blankProgress };
          progressRef.current = next;
          identityRef.current = { session: 'guest', uid: null };
          setProgress(next);
          setSession('guest');
        } else {
          identityRef.current = { session: null, uid: null };
          setSession(null);
        }
        setUser(null);
      }
      if (token === loadToken.current) setLoading(false);
    });
  }, []);

  const persist = (next: LearnerProgress) => {
    progressRef.current = next;
    setProgress(next);
    const identity = { ...identityRef.current };
    pendingSave.current = pendingSave.current.catch(() => undefined).then(async () => {
      if (identity.session === 'cloud' && identity.uid && db) {
        await setDoc(doc(db, 'users', identity.uid, 'data', 'progress'), next);
      } else if (identity.session === 'guest') {
        await AsyncStorage.setItem(GUEST_DATA_KEY, JSON.stringify(next));
      }
    }).catch(error => console.warn('Could not save learning progress:', error));
  };
  const modify = (change: (old: LearnerProgress) => LearnerProgress) => persist(change(progressRef.current));
  const studied = (old: LearnerProgress): string[] => Array.from(new Set([...old.studyDays, dayKey()]));

  const startGuest = async () => {
    await AsyncStorage.setItem(GUEST_ACTIVE_KEY, 'true');
    await loadGuest();
  };
  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('First configure Firebase in your .env file.');
    await signInWithEmailAndPassword(auth, email.trim(), password);
    await AsyncStorage.removeItem(GUEST_ACTIVE_KEY);
  };
  const register = async (email: string, password: string) => {
    if (!auth) throw new Error('First configure Firebase in your .env file.');
    await createUserWithEmailAndPassword(auth, email.trim(), password);
    await AsyncStorage.removeItem(GUEST_ACTIVE_KEY);
  };
  const logout = async () => {
    await pendingSave.current.catch(() => undefined);
    ++loadToken.current;
    if (auth?.currentUser) {
      await AsyncStorage.removeItem(GUEST_ACTIVE_KEY);
      await signOut(auth);
    } else if (firebaseEnabled) {
      await AsyncStorage.removeItem(GUEST_ACTIVE_KEY);
      identityRef.current = { session: null, uid: null };
      setSession(null);
    } else {
      // In local-only mode keep the guest's data available after restarting.
      await loadGuest();
    }
  };
  const showLogin = async () => {
    if (!firebaseEnabled) return;
    await AsyncStorage.removeItem(GUEST_ACTIVE_KEY);
    ++loadToken.current;
    identityRef.current = { session: null, uid: null };
    setSession(null);
    setUser(null);
  };

  const completeLesson = (id: string) => modify(old => ({
    ...old, completed: old.completed.includes(id) ? old.completed : [...old.completed, id], studyDays: studied(old),
  }));
  const toggleBookmark = (id: string) => modify(old => ({
    ...old, bookmarks: old.bookmarks.includes(id) ? old.bookmarks.filter(x => x !== id) : [...old.bookmarks, id],
  }));
  const togglePractice = (id: string) => modify(old => ({
    ...old, practices: old.practices.includes(id) ? old.practices.filter(x => x !== id) : [...old.practices, id],
    studyDays: studied(old),
  }));
  const recordQuiz = (id: string, answers: number[], score: number, total: number) => modify(old => ({
    ...old, quizzes: { ...old.quizzes, [id]: { answers, score, total, completedAt: new Date().toISOString() } },
    studyDays: studied(old),
  }));
  const setColorMode = (theme: ColorMode) => modify(old => ({ ...old, theme }));
  const setReminder = (reminderEnabled: boolean, reminderHour: number) => modify(old => ({ ...old, reminderEnabled, reminderHour }));
  const setDisplayName = (name: string) => modify(old => ({ ...old, name: name.trim().slice(0, 50) }));
  const resetLearning = () => modify(old => ({ ...old, completed: [], bookmarks: [], practices: [], quizzes: {}, studyDays: [] }));

  const isDark = progress.theme === 'dark' || (progress.theme === 'system' && systemColor === 'dark');
  return <AppContext.Provider value={{
    session, firebaseEnabled, user, loading, colors: isDark ? darkColors : lightColors, isDark, progress,
    startGuest, login, register, logout, showLogin, completeLesson, toggleBookmark,
    togglePractice, recordQuiz, setColorMode, setReminder, setDisplayName, resetLearning,
  }}>{children}</AppContext.Provider>;
}

function safeParse(raw: string): LearnerProgress {
  try { return validProgress(JSON.parse(raw)); }
  catch { return { ...blankProgress }; }
}
