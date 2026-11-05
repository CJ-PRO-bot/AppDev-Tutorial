import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Page, Button, Card, Txt } from '../ui/Elements';
import { useApp } from '../state/AppState';

export function AuthScreen() {
  const { colors, firebaseEnabled, login, register, startGuest } = useApp();
  const [form, setForm] = useState<'intro' | 'login' | 'register'>('intro');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError('');
    if (!email.trim().includes('@')) { setError('Enter a valid email address.'); return; }
    if (password.length < 6) { setError('Use a password of at least 6 characters.'); return; }
    try {
      setBusy(true);
      if (form === 'register') await register(email, password);
      else await login(email, password);
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Authentication failed';
      setError(raw.includes('auth/email-already-in-use') ? 'This email already has an account.'
        : raw.includes('auth/invalid-credential') ? 'Email or password is incorrect.'
        : raw.includes('auth/weak-password') ? 'Please choose a stronger password.' : raw);
    } finally { setBusy(false); }
  };

  return <Page>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ alignItems: 'center', paddingTop: 44, paddingBottom: 26 }}>
        <View style={{ backgroundColor: colors.tint, padding: 21, borderRadius: 24, marginBottom: 20 }}>
          <Ionicons name="code-slash" size={49} color={colors.primary} />
        </View>
        <Txt size={32} weight="bold">AppDev Tutorial</Txt>
        <Txt size={15} muted style={{ textAlign: 'center', marginTop: 8 }}>Learn. Build. Practice. Repeat.</Txt>
      </View>
      {form === 'intro' ? <>
        <Card>
          <Txt size={20} weight="bold">Your mobile development journey starts here</Txt>
          <Txt muted style={{ marginTop: 9, marginBottom: 16 }}>Explore 16 hands-on lessons, real code examples, quizzes, guided paths and saved progress.</Txt>
          <Button title="Explore as guest" icon="arrow-forward" onPress={() => { void startGuest(); }} />
          <Txt size={12} muted style={{ marginTop: 10, textAlign: 'center' }}>Guest progress stays on this device.</Txt>
        </Card>
        {firebaseEnabled && <Button title="Sign in or create an account" secondary icon="person-outline" onPress={() => setForm('login')} />}
        {!firebaseEnabled && <Txt size={12} muted style={{ textAlign: 'center', marginTop: 17 }}>Firebase is optional. Configure .env to enable cloud accounts and syncing.</Txt>}
      </> : <Card>
        <Pressable accessibilityRole="button" onPress={() => {setForm('intro'); setError('');}} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Ionicons name="arrow-back" size={18} color={colors.primary} /><Txt size={13} style={{ color: colors.primary }}>Back</Txt>
        </Pressable>
        <Txt size={23} weight="bold">{form === 'register' ? 'Create an account' : 'Welcome back'}</Txt>
        <Txt muted style={{ marginBottom: 19 }}>Your lessons and progress can be synced using Firebase.</Txt>
        <Txt size={13} weight="semibold" style={{ marginBottom: 6 }}>Email address</Txt>
        <TextInput keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={colors.muted} style={{ color: colors.text, backgroundColor: colors.bg, borderColor: colors.border, borderWidth: 1, borderRadius: 11, padding: 13, marginBottom: 14 }} />
        <Txt size={13} weight="semibold" style={{ marginBottom: 6 }}>Password</Txt>
        <TextInput secureTextEntry autoComplete={form === 'register' ? 'new-password' : 'current-password'} value={password} onChangeText={setPassword} placeholder="At least 6 characters" placeholderTextColor={colors.muted} style={{ color: colors.text, backgroundColor: colors.bg, borderColor: colors.border, borderWidth: 1, borderRadius: 11, padding: 13, marginBottom: 12 }} />
        {error ? <Txt size={13} style={{ color: colors.danger, marginBottom: 12 }}>{error}</Txt> : null}
        {busy ? <ActivityIndicator color={colors.primary} /> : <Button title={form === 'register' ? 'Create account' : 'Sign in'} onPress={() => { void submit(); }} />}
        <Pressable accessibilityRole="button" style={{ marginTop: 18, alignItems: 'center' }} onPress={() => {setForm(form === 'login' ? 'register' : 'login'); setError('');}}>
          <Txt size={13} style={{ color: colors.primary }}>{form === 'login' ? 'New here? Create an account' : 'Have an account? Sign in'}</Txt>
        </Pressable>
      </Card>}
    </KeyboardAvoidingView>
  </Page>;
}
