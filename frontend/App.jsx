import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import TabNavigator from './navigation/TabNavigator';  // <-- import tabs here
import MeditationScreen from './screens/MeditationScreen';
import MeditationDetailScreen from './screens/MeditationDetailScreen';
import MusicScreen from './screens/MusicScreen';
import ExerciseScreen from './screens/ExerciseScreen';
import JournalScreen from './screens/JournalScreen';
import AudioPlayerScreen from './screens/AudioPlayerScreen';
import ExerciseDetailScreen from './screens/ExerciseDetailScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Meditation" component={MeditationScreen} />
      <Stack.Screen name="MeditationDetail" component={MeditationDetailScreen} />
      <Stack.Screen name="Music" component={MusicScreen} />
      <Stack.Screen name="Exercise" component={ExerciseScreen} />
      <Stack.Screen name="Journal" component={JournalScreen} />
      <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none"
  }
});
