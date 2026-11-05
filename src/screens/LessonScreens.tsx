import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getCategory, getLesson } from '../data/curriculum';
import { useApp } from '../state/AppState';
import { Button, Card, IconButton, Page, SectionTitle, Tag, Txt } from '../ui/Elements';
import type { RootStackParamList } from '../navigation';

type LessonProps = NativeStackScreenProps<RootStackParamList, 'Lesson'>;
type QuizProps = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

function BackLine({ onBack, title }: { onBack: () => void; title: string }) {
  const { colors } = useApp();
  return <Pressable accessibilityRole="button" onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 7, marginBottom: 14 }}>
    <Ionicons name="arrow-back" size={19} color={colors.primary} />
    <Txt size={14} weight="semibold" style={{ color: colors.primary }}>{title}</Txt>
  </Pressable>;
}
export function LessonScreen({ navigation, route }: LessonProps) {
  const { colors, progress, toggleBookmark, togglePractice, completeLesson } = useApp();
  const [copied, setCopied] = useState(false);
  const lesson = getLesson(route.params.id);
  if (!lesson) return <Page><BackLine onBack={() => navigation.goBack()} title="Back" /><Txt>Lesson not found.</Txt></Page>;
  const category = getCategory(lesson.categoryId);
  const saved = progress.bookmarks.includes(lesson.id);
  const completed = progress.completed.includes(lesson.id);
  const practiced = progress.practices.includes(lesson.id);
  const hasQuiz = Boolean(progress.quizzes[lesson.id]);
  const copy = async () => {
    try { await Clipboard.setStringAsync(lesson.code); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { setCopied(false); }
  };
  return <Page>
    <BackLine onBack={() => navigation.goBack()} title="Back to tutorials" />
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 13 }}>
      <View style={{ flex: 1 }}><Tag text={category.name} accent /><Txt size={27} weight="bold" style={{ marginTop: 11 }}>{lesson.title}</Txt>
        <Txt muted style={{ marginTop: 7 }}>{lesson.summary}</Txt></View>
      <IconButton icon={saved ? 'bookmark' : 'bookmark-outline'} active={saved} onPress={() => toggleBookmark(lesson.id)} label={saved ? 'Remove saved lesson' : 'Save this lesson'} />
    </View>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
      <Tag text={`${lesson.minutes} minute lesson`} /><Tag text={lesson.level} />{completed && <Tag text="Completed ✓" accent />}
    </View>
    <Card><Txt size={18} weight="bold" style={{ marginBottom: 10 }}>What you'll learn</Txt><Txt style={{ lineHeight: 24 }}>{lesson.introduction}</Txt></Card>
    <SectionTitle title="Step-by-step guide" />
    <Card>{lesson.steps.map((step, index) => <View key={index} style={{ flexDirection: 'row', gap: 11, marginBottom: index === lesson.steps.length-1 ? 0 : 19 }}>
      <View style={{ width: 28, height: 28, backgroundColor: colors.tint, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }}><Txt size={13} weight="bold" style={{ color: colors.primary }}>{index+1}</Txt></View>
      <View style={{ flex: 1 }}><Txt style={{ lineHeight: 23 }}>{step}</Txt></View>
    </View>)}</Card>
    <SectionTitle title="Code example" subtitle={lesson.exampleTitle} />
    <View style={{ borderRadius: 17, overflow: 'hidden', marginBottom: 13, backgroundColor: colors.codeBg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#344056' }}>
        <Text style={{ color: '#99A9D1', fontSize: 12, fontWeight: '600' }}>{lesson.codeLanguage}</Text>
        <Pressable accessibilityRole="button" onPress={() => {void copy();}} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={16} color="#D6DFFF" />
          <Text style={{ color: '#D6DFFF', fontSize: 12 }}>{copied ? 'Copied!' : 'Copy code'}</Text>
        </Pressable>
      </View>
      <Text selectable style={{ color: '#E3E9FC', fontFamily: 'monospace', fontSize: 12.5, lineHeight: 21, padding: 17 }}>{lesson.code}</Text>
    </View>
    <Card style={{ backgroundColor: colors.tint, borderColor: colors.tint }}>
      <View style={{ flexDirection: 'row', gap: 9 }}><Ionicons name="bulb-outline" size={21} color={colors.primary} /><View style={{ flex: 1 }}><Txt weight="bold">Quick tip</Txt><Txt size={14} style={{ marginTop: 5 }}>{lesson.tip}</Txt></View></View>
    </Card>
    <SectionTitle title="Practice activity" subtitle="Try this outside the app, then mark it complete" />
    <Card><Txt style={{ lineHeight: 23 }}>{lesson.practice}</Txt>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: practiced }} onPress={() => togglePractice(lesson.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 17, paddingVertical: 6 }}>
        <Ionicons name={practiced ? 'checkbox' : 'square-outline'} color={practiced ? colors.success : colors.primary} size={26} />
        <Txt weight="semibold" style={{ color: practiced ? colors.success : colors.text }}>{practiced ? 'Practice task completed' : 'I completed this practice task'}</Txt>
      </Pressable>
    </Card>
    <SectionTitle title="Check your knowledge" subtitle="Answer two quick questions" />
    <Card><Txt muted style={{ marginBottom: 15 }}>Take a short quiz to check your understanding. You can retry at any time.</Txt>
      {hasQuiz && <Tag text={`Your last score: ${progress.quizzes[lesson.id].score}/${progress.quizzes[lesson.id].total}`} accent />}
      <View style={{ marginTop: 14 }}><Button title={hasQuiz ? 'Retake quiz' : 'Start quiz'} onPress={() => navigation.navigate('Quiz', { id: lesson.id })} icon="help-circle-outline" /></View>
    </Card>
    <Button title={completed ? 'Lesson completed ✓' : 'Mark lesson complete'} secondary={completed} icon="checkmark-circle-outline" onPress={() => completeLesson(lesson.id)} />
    <Txt size={12} muted style={{ textAlign: 'center', marginTop: 12 }}>Lessons, practice and quizzes are tracked independently.</Txt>
  </Page>;
}

export function QuizScreen({ navigation, route }: QuizProps) {
  const { colors, progress, recordQuiz } = useApp();
  const lesson = getLesson(route.params.id);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  if (!lesson) return <Page><BackLine onBack={() => navigation.goBack()} title="Back" /><Txt>Quiz not found.</Txt></Page>;
  const allAnswered = Object.keys(answers).length === lesson.quiz.length;
  const submit = () => {
    if (!allAnswered) return;
    const choices = lesson.quiz.map((_, index) => answers[index]);
    const points = choices.filter((choice, index) => choice === lesson.quiz[index].correct).length;
    setScore(points);
    setSubmitted(true);
    recordQuiz(lesson.id, choices, points, lesson.quiz.length);
  };
  const reset = () => { setAnswers({}); setScore(0); setSubmitted(false); };
  return <Page>
    <BackLine onBack={() => navigation.goBack()} title="Back to lesson" />
    <Tag text="Knowledge check" accent />
    <Txt size={26} weight="bold" style={{ marginTop: 10 }}>Quiz: {lesson.title}</Txt>
    <Txt muted style={{ marginTop: 6, marginBottom: 20 }}>Select one answer for each question.</Txt>
    {submitted && <Card style={{ backgroundColor: colors.tint, borderColor: colors.tint }}>
      <View style={{ alignItems: 'center' }}><Ionicons name={score === lesson.quiz.length ? 'trophy' : 'ribbon-outline'} size={43} color={colors.primary} />
        <Txt size={31} weight="bold" style={{ marginTop: 9 }}>{score} / {lesson.quiz.length}</Txt><Txt muted>{Math.round(score / lesson.quiz.length * 100)}% · Score saved to your profile</Txt></View>
    </Card>}
    {lesson.quiz.map((question, idx) => <Card key={idx}>
      <Txt size={12} weight="bold" style={{ color: colors.primary, marginBottom: 8 }}>QUESTION {idx + 1} OF {lesson.quiz.length}</Txt>
      <Txt size={17} weight="bold" style={{ marginBottom: 14 }}>{question.question}</Txt>
      {question.answers.map((answer, choice) => {
        const selected = answers[idx] === choice;
        const correct = submitted && question.correct === choice;
        const wrong = submitted && selected && !correct;
        const bg = correct ? colors.successTint : wrong ? colors.soft : selected ? colors.tint : colors.bg;
        const border = correct ? colors.success : wrong ? colors.danger : selected ? colors.primary : colors.border;
        return <Pressable key={choice} accessibilityRole="radio" accessibilityState={{ selected }} disabled={submitted} onPress={() => setAnswers(old => ({...old, [idx]: choice}))}
          style={{ backgroundColor: bg, borderColor: border, borderWidth: 1.5, borderRadius: 12, padding: 12, marginBottom: 9, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Ionicons name={correct ? 'checkmark-circle' : wrong ? 'close-circle' : selected ? 'radio-button-on' : 'radio-button-off'} color={correct ? colors.success : wrong ? colors.danger : selected ? colors.primary : colors.muted} size={20} />
          <View style={{ flex: 1 }}><Txt size={13}>{answer}</Txt></View>
        </Pressable>;
      })}
      {submitted && <View style={{ backgroundColor: colors.soft, padding: 11, borderRadius: 10, marginTop: 5 }}><Txt size={13}>{question.explanation}</Txt></View>}
    </Card>)}
    {!submitted ? <>
      <Button title="Submit answers" disabled={!allAnswered} icon="checkmark-done" onPress={submit} />
      {!allAnswered && <Txt size={12} muted style={{ marginTop: 10, textAlign: 'center' }}>Answer all {lesson.quiz.length} questions to submit.</Txt>}
    </> : <View style={{ gap: 11 }}>
      <Button title="Try again" icon="refresh-outline" onPress={reset} />
      <Button title="Return to lesson" secondary icon="arrow-back" onPress={() => navigation.goBack()} />
    </View>}
    {!submitted && progress.quizzes[lesson.id] && <Txt size={12} muted style={{ marginTop: 13, textAlign: 'center' }}>Previous score: {progress.quizzes[lesson.id].score}/{progress.quizzes[lesson.id].total}</Txt>}
  </Page>;
}
