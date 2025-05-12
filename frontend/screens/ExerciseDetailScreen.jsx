import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExerciseDetailScreen({ route }) {
  const { exercise } = route.params; // Receive exercise object

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: exercise.image }} style={styles.image} />
        <Text style={styles.title}>{exercise.title}</Text>
        <Text style={styles.level}>Level: {exercise.level}</Text>
        <Text style={styles.duration}>Duration: {exercise.duration}</Text>
        <Text style={styles.description}>{exercise.description}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FF",
  },
  scrollContent: {
    padding: 16,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  level: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  duration: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginTop: 12,
    textAlign: "center",
  },
});
