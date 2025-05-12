import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { meditationTypes } from "../data/meditationData"


const MeditationCard = ({
  title,
  duration,
  icon,
  description,
  image,
  onPress
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: image }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color="#6A5ACD" />
        <Text style={styles.duration}>{duration}</Text>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  </TouchableOpacity>
)

export default function MeditationScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meditation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Choose Your Practice</Text>

        {meditationTypes.map(meditation => (
          <MeditationCard
            key={meditation.id}
            {...meditation}
            onPress={() =>
              navigation.navigate("MeditationDetail", { meditation })
            }
            
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
  scrollContent: {
    padding: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333"
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
    height: 160,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  cardContent: {
    padding: 16
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  duration: {
    fontSize: 14,
    color: "#6A5ACD",
    fontWeight: "500"
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20
  }
})
