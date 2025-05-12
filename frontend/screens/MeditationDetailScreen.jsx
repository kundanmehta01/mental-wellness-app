import React, { useState, useEffect } from 'react'; // Ensure React is imported
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";  // Import Axios
import { Audio } from "expo-av";  // Import Audio from expo-av
import { useFocusEffect } from '@react-navigation/native';  // Import useFocusEffect

export default function MeditationDetailScreen({ route, navigation }) {
  const { meditation } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Mapping meditation titles to Freesound search keywords
  const titleToSearchKeyword = {
    "Mindfulness Meditation": "mindfulness meditation",
    "Chakra Meditation": "chakra meditation music",
    "Transcendental Meditation": "transcendental meditation",
    "Mantra Meditation": "mantra meditation sound",
  };

  // Fetch audio URL based on the search query
  const fetchAudioUrl = async (query) => {
    const API_KEY = 'ApKecoEW3uryvR61uzmcff51UcS2idtXRsBmsEfY';  // Replace with your Freesound API key
    const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&fields=previews&token=${API_KEY}`;

    try {
      const response = await axios.get(url);
      const sounds = response.data.results;

      if (!sounds.length) {
        throw new Error(`No audio found for query: ${query}`);
      }

      return sounds[0].previews["preview-hq-mp3"];  // Returning the high-quality preview link
    } catch (e) {
      setError("Error fetching audio.");
      console.error("Error fetching audio:", e);
      throw e;
    }
  };

  // Load and play sound from Freesound API
  const loadAndPlaySound = async () => {
    const searchKeyword = titleToSearchKeyword[meditation.title] || meditation.title;  // Default to the title if no match
    try {
      const audioUrl = await fetchAudioUrl(searchKeyword);

      if (!audioUrl) {
        setError("No audio found for this title.");
        setIsLoading(false);
        return;
      }

      console.log('Loading audio from:', audioUrl);
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false }
      );
      setSound(sound);
      setIsLoading(false);
    } catch (e) {
      setError("Error loading audio.");
      setIsLoading(false);
    }
  };

  // Toggle play/pause functionality
  const togglePlay = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  // Cleanup when the screen is unfocused
  useEffect(() => {
    loadAndPlaySound();

    return () => {
      if (sound) {
        console.log('Unloading sound');
        sound.stopAsync().then(() => {
          sound.unloadAsync();
        });
      }
    };
  }, [meditation.title]);

  // Stop audio when leaving this screen
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound) {
          console.log('Unloading sound due to focus change');
          sound.stopAsync().then(() => {
            sound.unloadAsync();
          });
        }
      };
    }, [sound])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: meditation.image }} style={styles.coverImage} />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Meditation")}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{meditation.title}</Text>
          <Text style={styles.duration}>{meditation.duration}</Text>
          <Text style={styles.description}>{meditation.description}</Text>

          <View style={styles.playerCard}>
            <LinearGradient
              colors={["#E6E6FA", "#F0F8FF"]}
              style={styles.playerGradient}
            >
              <View style={styles.progressBar}>
                <View
                  style={[styles.progress, { width: `${(currentTime / 600) * 100}%` }]}
                />
              </View>

              <View style={styles.controls}>
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="play-skip-back" size={24} color="#6A5ACD" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.playButton}
                  onPress={togglePlay}
                >
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={32}
                    color="#6A5ACD"
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons
                    name="play-skip-forward"
                    size={24}
                    color="#6A5ACD"
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {error ? (
            <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
          ) : null}

          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Benefits</Text>
            <View style={styles.benefitsList}>
              <BenefitItem icon="brain" text="Improved Focus" />
              <BenefitItem icon="heart" text="Reduced Stress" />
              <BenefitItem icon="bed" text="Better Sleep" />
              <BenefitItem icon="happy" text="Enhanced Mood" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BenefitItem = ({ icon, text }) => (
  <View style={styles.benefitItem}>
    <Ionicons name={icon} size={24} color="#6A5ACD" />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FF",
  },
  coverImage: {
    width: "100%",
    height: 300,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  duration: {
    fontSize: 16,
    color: "#6A5ACD",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  playerCard: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 24,
  },
  playerGradient: {
    padding: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    marginBottom: 20,
  },
  progress: {
    height: "100%",
    backgroundColor: "#6A5ACD",
    borderRadius: 2,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    padding: 20,
    marginHorizontal: 30,
    backgroundColor: "white",
    borderRadius: 30,
  },
  benefitsSection: {
    marginTop: 24,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  benefitsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  benefitItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  benefitText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
});
