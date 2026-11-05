/** Offline, curated teaching content. Code examples are text, never evaluated in the app. */
export type CategoryId = 'fundamentals' | 'interface' | 'navigation' | 'data';
export type QuizQuestion = { question: string; answers: [string, string, string, string]; correct: number; explanation: string };
export type Lesson = {
  id: string; categoryId: CategoryId; title: string; summary: string;
  level: 'Beginner' | 'Intermediate'; minutes: number;
  introduction: string; steps: string[]; exampleTitle: string; code: string; codeLanguage: string;
  tip: string; practice: string; quiz: QuizQuestion[];
};
export type Category = { id: CategoryId; name: string; subtitle: string; icon: string; accent: string };

export const categories: Category[] = [
  { id: 'fundamentals', name: 'Getting Started', subtitle: 'App fundamentals & tools', icon: 'terminal-outline', accent: '#635BDF' },
  { id: 'interface', name: 'Build Interfaces', subtitle: 'Components & styling', icon: 'color-palette-outline', accent: '#169F9C' },
  { id: 'navigation', name: 'Make It Interactive', subtitle: 'Navigation & state', icon: 'git-branch-outline', accent: '#DE8B2C' },
  { id: 'data', name: 'Store & Launch', subtitle: 'Data, APIs & publishing', icon: 'cloud-outline', accent: '#D35F85' },
];
const q = (question: string, answers: [string,string,string,string], correct: number, explanation: string): QuizQuestion => ({question, answers, correct, explanation});

export const lessons: Lesson[] = [
  {
    id: 'intro-apps', categoryId: 'fundamentals', title: 'How mobile apps work', summary: 'Understand screens, UI, logic and data.', level: 'Beginner', minutes: 7,
    introduction: 'A mobile application combines a user interface with application logic and data. React Native makes it possible to share much of your code between Android and iOS.',
    steps: ['Identify the screens your app needs, such as Home, Lesson and Profile.', 'Describe what the user can do on each screen.', 'Separate UI components, logic and stored information.'],
    exampleTitle: 'A small reusable function', codeLanguage: 'TypeScript', code: `type Learner = { name: string };\n\nfunction welcome(user: Learner) {\n  return \`Hello, \${user.name}!\`;\n}\n\nconsole.log(welcome({ name: 'Chabsel' }));`,
    tip: 'First design the user journey; then decide what to code.', practice: 'Sketch three screens for a tutorial application and list one interaction on each.',
    quiz: [q('What is a screen?', ['A database table', 'A view a user interacts with', 'An internet connection', 'A programming language'], 1, 'A screen is a visible part of an app interface.'), q('Which part stores saved records?', ['Data layer', 'Font size', 'Device wallpaper', 'Status bar'], 0, 'The data layer persists records locally or in a remote database.')]
  },
  {
    id: 'tools-setup', categoryId: 'fundamentals', title: 'Set up your environment', summary: 'Install Node, VS Code and Expo Go.', level: 'Beginner', minutes: 9,
    introduction: 'Expo provides a simple workflow for building and previewing React Native apps. VS Code is your editor and Node.js runs the development tools.',
    steps: ['Install the current supported Node.js LTS release and VS Code.', 'Create an Expo project and open it in VS Code.', 'Start the development server and open the project using Expo Go.'],
    exampleTitle: 'Terminal commands', codeLanguage: 'PowerShell', code: `npx create-expo-app@latest my-first-app\ncd my-first-app\nnpx expo start`,
    tip: 'Keep your phone and computer on the same Wi-Fi for easiest Expo Go testing.', practice: 'Create a sample project and change its opening heading.',
    quiz: [q('What does VS Code primarily do?', ['Edit source code', 'Host an app store', 'Charge a phone', 'Replace the operating system'], 0, 'VS Code is a source code editor.'), q('What starts the Expo development server?', ['npm delete', 'npx expo start', 'git remove', 'node uninstall'], 1, 'Expo CLI starts the Metro development server.')]
  },
  {
    id: 'typescript-basics', categoryId: 'fundamentals', title: 'TypeScript essentials', summary: 'Variables, functions and safe types.', level: 'Beginner', minutes: 11,
    introduction: 'TypeScript adds static types to JavaScript. It helps your editor catch common mistakes before the app runs.',
    steps: ['Create variables using const or let.', 'Give objects clear type definitions.', 'Add input and return types to functions.'],
    exampleTitle: 'A typed activity', codeLanguage: 'TypeScript', code: `type LessonProgress = {\n  title: string;\n  completed: boolean;\n};\n\nfunction getLabel(item: LessonProgress): string {\n  return item.completed ? 'Done' : 'Start';\n}`,
    tip: 'Prefer const when you do not need to reassign a variable.', practice: 'Write a typed Student object with name, course and completedLessons fields.',
    quiz: [q('Which keyword declares an immutable binding?', ['var', 'const', 'move', 'set'], 1, 'const prevents reassignment of that variable.'), q('What does TypeScript add?', ['Static type checking', 'A new phone OS', 'Automatic internet', 'Only animations'], 0, 'TypeScript helps catch type errors during development.')]
  },
  {
    id: 'project-structure', categoryId: 'fundamentals', title: 'Organize a React Native project', summary: 'Keep screens and data maintainable.', level: 'Beginner', minutes: 8,
    introduction: 'Splitting code by responsibility makes apps easier to maintain. A typical app has reusable UI, screens, data and services.',
    steps: ['Create separate folders for screens, components and data.', 'Keep user interface independent of cloud services when possible.', 'Use clear file names and consistent imports.'],
    exampleTitle: 'Example folder layout', codeLanguage: 'Text', code: `src/\n  screens/\n    HomeScreen.tsx\n    LessonScreen.tsx\n  components/\n    LessonCard.tsx\n  data/\n    lessons.ts\n  services/\n    firebase.ts`,
    tip: 'Start simple. Add folders when complexity actually grows.', practice: 'Design a folder structure for a four-screen learning app.',
    quiz: [q('Why create reusable components?', ['To duplicate code', 'To share UI and reduce repetition', 'To disable navigation', 'To avoid testing'], 1, 'Reusable components keep the interface consistent.'), q('Where should tutorial content live?', ['In an organized data module', 'Only in an icon name', 'Only in app.json', 'In package-lock.json'], 0, 'Content can be maintained in a separate data module.')]
  },
  {
    id: 'components', categoryId: 'interface', title: 'React Native components', summary: 'Learn View, Text and Pressable.', level: 'Beginner', minutes: 10,
    introduction: 'React Native uses platform-aware components rather than HTML tags. View, Text, ScrollView and Pressable are common building blocks.',
    steps: ['Use View to group elements.', 'Use Text for visible strings.', 'Use Pressable for tap interactions and handle onPress.'],
    exampleTitle: 'Your first interactive card', codeLanguage: 'TSX', code: `import { View, Text, Pressable } from 'react-native';\n\nexport function HelloCard() {\n  return (\n    <View>\n      <Text>Welcome to AppDev!</Text>\n      <Pressable onPress={() => alert('Great start!')}>\n        <Text>Tap me</Text>\n      </Pressable>\n    </View>\n  );\n}`,
    tip: 'Every text string visible in a React Native view belongs inside a Text component.', practice: 'Create a card with a title and a button that reacts when tapped.',
    quiz: [q('Which component contains visible text?', ['Text', 'Picture', 'Body', 'LabelHTML'], 0, 'React Native uses Text for strings.'), q('What handles tap events?', ['onPress', 'onHoverOnly', 'onSQL', 'onCompile'], 0, 'Pressable calls onPress when activated.')]
  },
  {
    id: 'styles', categoryId: 'interface', title: 'Style with Flexbox', summary: 'Layouts, spacing and alignment.', level: 'Beginner', minutes: 10,
    introduction: 'React Native styles are JavaScript objects. Flexbox positions elements within a container and adapts across screen sizes.',
    steps: ['Create a StyleSheet for shared styles.', 'Use flexDirection to choose row or column.', 'Use padding, gap and alignItems for spacing and alignment.'],
    exampleTitle: 'Two items in a row', codeLanguage: 'TSX', code: `import { StyleSheet, View, Text } from 'react-native';\n\nexport function TwoCards() {\n  return <View style={styles.row}>\n    <Text>Learn</Text><Text>Practice</Text>\n  </View>;\n}\nconst styles = StyleSheet.create({\n  row: { flexDirection: 'row', gap: 16, padding: 20 }\n});`,
    tip: 'The default flexDirection in React Native is column.', practice: 'Arrange two button cards side by side and add equal spacing.',
    quiz: [q('What is the default flex direction?', ['row', 'column', 'grid', 'absolute'], 1, 'React Native defaults to a vertical column.'), q('Which property adds internal spacing?', ['padding', 'marginBottomOnly', 'opacity', 'zIndex'], 0, 'Padding is the space inside the component boundary.')]
  },
  {
    id: 'input-forms', categoryId: 'interface', title: 'Forms and user input', summary: 'Create a form with validation.', level: 'Beginner', minutes: 12,
    introduction: 'TextInput captures information entered by a user. Keep form values in component state and validate them before submission.',
    steps: ['Add a TextInput with a useful placeholder.', 'Connect its value to React state.', 'Validate empty or invalid input and show feedback.'],
    exampleTitle: 'A controlled input', codeLanguage: 'TSX', code: `import { useState } from 'react';\nimport { TextInput, Text, View } from 'react-native';\n\nexport function NameForm() {\n  const [name, setName] = useState('');\n  return <View>\n    <TextInput value={name} onChangeText={setName}\n      placeholder="Enter your name" />\n    <Text>Hello {name || 'learner'}!</Text>\n  </View>;\n}`,
    tip: 'A controlled TextInput reads from state and updates the state on change.', practice: 'Create a field for the name of a personal project and show its live preview.',
    quiz: [q('Which component receives typed text?', ['TextInput', 'View', 'ScrollView', 'SafeArea'], 0, 'TextInput is used for typing.'), q('Why validate form values?', ['To prevent incorrect input', 'To remove buttons', 'To stop rendering', 'To change the OS'], 0, 'Validation prevents bad data and improves feedback.')]
  },
  {
    id: 'accessibility', categoryId: 'interface', title: 'Accessible app design', summary: 'Create readable, usable experiences.', level: 'Intermediate', minutes: 9,
    introduction: 'Accessibility allows more people to use your app. Good contrast, tappable controls and descriptive labels are practical starting points.',
    steps: ['Use clear headings and descriptive button labels.', 'Make tap targets comfortable to reach.', 'Add accessibilityLabel and accessibilityRole where needed.'],
    exampleTitle: 'An accessible action', codeLanguage: 'TSX', code: `<Pressable\n  accessibilityRole="button"\n  accessibilityLabel="Mark this lesson complete"\n  onPress={markCompleted}\n>\n  <Text>Complete lesson</Text>\n</Pressable>`,
    tip: 'Check the app using screen reader settings on a physical phone.', practice: 'Review one screen and improve its labels, spacing and text contrast.',
    quiz: [q('What helps screen-reader users?', ['Descriptive labels', 'Hidden-only instructions', 'Tiny tap targets', 'Low contrast'], 0, 'Descriptive labels make controls understandable.'), q('Good touch targets should be...', ['Easy to tap', 'As small as possible', 'Invisible', 'Text-free'], 0, 'Comfortable targets help users interact accurately.')]
  },
  {
    id: 'state', categoryId: 'navigation', title: 'React state and hooks', summary: 'Make screens respond to actions.', level: 'Beginner', minutes: 11,
    introduction: 'State stores information that can change while a component runs. React re-renders the interface when state is updated.',
    steps: ['Import useState from React.', 'Read the current state value.', 'Call the setter when a button is pressed.'],
    exampleTitle: 'Simple study counter', codeLanguage: 'TSX', code: `import { useState } from 'react';\nimport { Button, Text, View } from 'react-native';\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  return <View>\n    <Text>Tasks: {count}</Text>\n    <Button title="Add" onPress={() => setCount(n => n + 1)} />\n  </View>;\n}`,
    tip: 'Use a functional state update when the next value depends on the previous one.', practice: 'Create a counter for completed practice sessions with + and reset actions.',
    quiz: [q('What hook stores changing data?', ['useState', 'useStyles', 'useRouteOnly', 'useDatabase'], 0, 'useState stores local component state.'), q('What causes React to render a new count?', ['Calling its state setter', 'Renaming a variable alone', 'Writing a comment', 'Adding a folder'], 0, 'Updating state tells React to re-render.')]
  },
  {
    id: 'navigation', categoryId: 'navigation', title: 'Navigate between screens', summary: 'Build a multi-screen flow.', level: 'Intermediate', minutes: 12,
    introduction: 'React Navigation manages screen transitions. Stack navigation is useful for details; bottom tabs work well for main sections.',
    steps: ['Declare the screen routes in a navigator.', 'Pass data such as a lesson ID as route params.', 'Use navigation.navigate to open another screen.'],
    exampleTitle: 'Navigate to a lesson', codeLanguage: 'TypeScript', code: `type RootStack = {\n  Home: undefined;\n  Lesson: { lessonId: string };\n};\n\n// Inside a component that has navigation:\nnavigation.navigate('Lesson', {\n  lessonId: 'intro-apps',\n});`,
    tip: 'Use typed route parameters to prevent mismatches in navigation.', practice: 'Design Home → Lesson → Quiz navigation for a tutorial app.',
    quiz: [q('What are route params used for?', ['Passing screen-specific values', 'Changing phone brightness', 'Installing Node', 'Compiling Java'], 0, 'Route params pass context such as IDs between screens.'), q('Which navigator fits the main app sections?', ['Bottom tabs', 'Only modal alerts', 'SQL tables', 'Package scripts'], 0, 'Tabs suit peer-level areas such as Home and Profile.')]
  },
  {
    id: 'lists', categoryId: 'navigation', title: 'Render dynamic lists', summary: 'Display data with FlatList.', level: 'Intermediate', minutes: 10,
    introduction: 'An app frequently displays collections such as lessons or notes. FlatList can render large lists efficiently with stable item keys.',
    steps: ['Create an array of data records.', 'Provide a renderItem callback.', 'Use a stable keyExtractor to identify each item.'],
    exampleTitle: 'List lesson titles', codeLanguage: 'TSX', code: `import { FlatList, Text } from 'react-native';\n\nconst topics = [\n  { id: 'ui', title: 'UI basics' },\n  { id: 'state', title: 'State' },\n];\n\n<FlatList\n  data={topics}\n  keyExtractor={item => item.id}\n  renderItem={({ item }) => <Text>{item.title}</Text>}\n/>`,
    tip: 'Prefer stable IDs over array indexes for list keys.', practice: 'Make a list of five tutorial topics and show their titles.',
    quiz: [q('Why use keyExtractor?', ['To identify list items', 'To set screen brightness', 'To log users in', 'To change GPS'], 0, 'Stable keys help React track items.'), q('Which component is built for performant lists?', ['FlatList', 'TextInput', 'ActivityIndicator', 'ImageBackground'], 0, 'FlatList renders lists efficiently.')]
  },
  {
    id: 'debugging', categoryId: 'navigation', title: 'Debug and test features', summary: 'Find issues before submission.', level: 'Intermediate', minutes: 11,
    introduction: 'Testing should cover successful paths, errors and unusual inputs. Debugging tools help you locate where a bug originates.',
    steps: ['Reproduce the problem using clear steps.', 'Read Metro and device error messages.', 'Test fixed behavior on both Android and iOS where available.'],
    exampleTitle: 'A guarded helper', codeLanguage: 'TypeScript', code: `function completionPercent(done: number, total: number) {\n  if (total <= 0) return 0;\n  return Math.round((done / total) * 100);\n}\n\nconsole.log(completionPercent(3, 5)); // 60`,
    tip: 'Test both normal cases and edge cases, including empty lists.', practice: 'List five test cases for a quiz scoring feature.',
    quiz: [q('What should you do first when debugging?', ['Reproduce the bug', 'Publish immediately', 'Delete all code', 'Ignore the logs'], 0, 'A reliable reproduction makes the issue easier to isolate.'), q('What is an edge case?', ['An unusual or boundary input', 'The app logo', 'A screenshot format', 'A normal font weight'], 0, 'Edge cases test uncommon but possible conditions.')]
  },
  {
    id: 'storage', categoryId: 'data', title: 'Save data locally', summary: 'Persist progress between sessions.', level: 'Intermediate', minutes: 11,
    introduction: 'Persistent storage preserves data after closing an app. AsyncStorage is useful for small non-sensitive values; it is not encrypted.',
    steps: ['Convert state to JSON before saving.', 'Read JSON after app startup.', 'Handle missing or invalid records safely.'],
    exampleTitle: 'Persist a completed lesson', codeLanguage: 'TypeScript', code: `import AsyncStorage from '@react-native-async-storage/async-storage';\n\nawait AsyncStorage.setItem('completed', JSON.stringify(['intro-apps']));\nconst raw = await AsyncStorage.getItem('completed');\nconst completed = raw ? JSON.parse(raw) : [];`,
    tip: 'Never store user passwords or private secrets in AsyncStorage.', practice: 'Save an array of favorite topics and restore it when your app restarts.',
    quiz: [q('What does AsyncStorage provide?', ['Local key-value persistence', 'A cloud password service', 'App store approval', 'Native camera hardware'], 0, 'AsyncStorage holds simple values on a device.'), q('Should passwords be stored in plain AsyncStorage?', ['No', 'Yes, always', 'Only with a long name', 'Only on Android'], 0, 'AsyncStorage is not designed for storing secrets.')]
  },
  {
    id: 'firebase', categoryId: 'data', title: 'Firebase authentication', summary: 'Introduce accounts and cloud storage.', level: 'Intermediate', minutes: 14,
    introduction: 'Firebase Authentication can register and sign in users. Cloud Firestore stores documents online. Access rules must ensure that only the owner can read or update private data.',
    steps: ['Create a Firebase project and enable Email/Password sign-in.', 'Register a Firebase web application and add its config.', 'Write Firestore rules to protect learner progress.'],
    exampleTitle: 'Email and password login', codeLanguage: 'TypeScript', code: `import { signInWithEmailAndPassword } from 'firebase/auth';\n\n// auth is your initialized Firebase Auth instance.\nawait signInWithEmailAndPassword(\n  auth, 'learner@example.com', 'your-password'\n);`,
    tip: 'Never commit admin credentials or service-account keys to GitHub.', practice: 'Write a Firestore rule that permits a signed-in user to access only their own document.',
    quiz: [q('Which Firebase product provides email login?', ['Authentication', 'Hosting only', 'Analytics only', 'Remote Config'], 0, 'Firebase Authentication handles identity and login.'), q('Why use Firestore security rules?', ['To restrict data access', 'To change a font', 'To speed up tapping', 'To choose a wallpaper'], 0, 'Rules enforce access controls on the server.')]
  },
  {
    id: 'api', categoryId: 'data', title: 'Fetch data from an API', summary: 'Learn requests and error handling.', level: 'Intermediate', minutes: 12,
    introduction: 'APIs allow a mobile app to communicate with servers. A fetch request is asynchronous and may fail when a network connection is unavailable.',
    steps: ['Use fetch to request a URL.', 'Check response.ok before reading data.', 'Use try/catch to show helpful failures.'],
    exampleTitle: 'Fetch and validate a response', codeLanguage: 'TypeScript', code: `async function fetchPost() {\n  try {\n    const response = await fetch(\n      'https://jsonplaceholder.typicode.com/posts/1'\n    );\n    if (!response.ok) throw new Error('Request failed');\n    return await response.json();\n  } catch (error) {\n    console.error(error);\n    return null;\n  }\n}`,
    tip: 'An API call should always handle loading and error states.', practice: 'Describe how your app will behave when the internet disconnects during a request.',
    quiz: [q('What does response.ok tell you?', ['Whether the HTTP status indicates success', 'Whether the phone has enough battery', 'Whether a form is beautiful', 'Whether a user is logged in'], 0, 'response.ok is true for successful HTTP statuses.'), q('Why use try/catch around fetch?', ['To handle network and parsing errors', 'To make the text bold', 'To save a screenshot', 'To generate an icon'], 0, 'Network requests can fail unexpectedly.')]
  },
  {
    id: 'release', categoryId: 'data', title: 'Prepare an app for release', summary: 'Polish, verify and document your app.', level: 'Intermediate', minutes: 10,
    introduction: 'A release-ready application should have a consistent interface, tested features, protected credentials and useful documentation.',
    steps: ['Test registration, navigation, quizzes and persistence.', 'Check Android and iOS layouts and accessibility.', 'Write setup instructions and remove secrets before publishing code.'],
    exampleTitle: 'A simple pre-release checklist', codeLanguage: 'Text', code: `[ ] No secret keys in repository\n[ ] New user onboarding tested\n[ ] Core screens and navigation tested\n[ ] Quiz score saved correctly\n[ ] Progress loads after restart\n[ ] Reminders tested on device\n[ ] README includes setup steps`,
    tip: 'Windows can develop for iOS through Expo Go but cannot run the iOS simulator locally.', practice: 'Create a test checklist and record a screenshot of each completed main feature.',
    quiz: [q('What belongs in a good README?', ['Setup and run instructions', 'A private password', 'A service-account key', 'Only a blank title'], 0, 'README files should help others run and understand the project.'), q('What must be checked before sharing source?', ['Secrets are excluded', 'App has no comments', 'All files are named temp', 'Git history is deleted'], 0, 'Private credentials must never be exposed in a public repository.')]
  }
];

export const getLesson = (id: string) => lessons.find(lesson => lesson.id === id);
export const getCategory = (id: CategoryId) => categories.find(cat => cat.id === id)!;
export const lessonsIn = (categoryId: CategoryId) => lessons.filter(lesson => lesson.categoryId === categoryId);
