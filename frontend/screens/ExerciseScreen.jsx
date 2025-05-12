import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { exercises } from "../data/ExerciseData"



const ExerciseCard = ({
  title,
  duration,
  level,
  description,
  image,
  onPress
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: image }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Ionicons name="time-outline" size={14} color="#6A5ACD" />
            <Text style={styles.badgeText}>{duration}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="fitness-outline" size={14} color="#6A5ACD" />
            <Text style={styles.badgeText}>{level}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  </TouchableOpacity>
)

export default function ExerciseScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
         onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mental Wellness Exercises</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            {...exercise}
            onPress={() => navigation.navigate("ExerciseDetail", { exercise })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FF"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0"
  },
  backButton: {
    padding: 8
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 16,
    color: "#333"
  },
  content: {
    padding: 16
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  cardContent: {
    padding: 16
  },
  cardHeader: {
    marginBottom: 8
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8
  },
  badges: {
    flexDirection: "row",
    marginBottom: 8
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0FF",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8
  },
  badgeText: {
    fontSize: 12,
    color: "#6A5ACD",
    marginLeft: 4
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20
  }
})
