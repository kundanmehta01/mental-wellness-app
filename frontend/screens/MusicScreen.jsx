import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { categories } from "../data/musicData"; 

const AudioCard = ({ title, duration, image, onPress }) => (
  <TouchableOpacity style={styles.audioCard} onPress={onPress}>
    {/* Add a fallback Image */}
    <Image 
      source={{ uri: image || 'https://via.placeholder.com/200' }} 
      style={styles.audioImage} 
    />
    <View style={styles.audioInfo}>
      <Text style={styles.audioTitle}>{title}</Text>
      <Text style={styles.audioDuration}>{duration}</Text>
    </View>
  </TouchableOpacity>
);

export default function MusicScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Music & Stories</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {categories.map(category => (
          <View key={category.id} style={styles.category}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.audioList}
            >
              {category.items.map(item => (
                <AudioCard
                  key={item.id}
                  {...item}
                  onPress={() =>
                    navigation.navigate("AudioPlayer", { audio: item })
                  }
                />
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
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
  category: {
    marginBottom: 24
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333"
  },
  audioList: {
    paddingRight: 16
  },
  audioCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  audioImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  audioInfo: {
    padding: 12
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4
  },
  audioDuration: {
    fontSize: 14,
    color: "#666"
  }
});
