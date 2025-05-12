import React, { useEffect, useState } from "react";  // Add this import
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';  // Import the hook

export default function AudioPlayerScreen({ route }) {
  const { audio } = route.params;
  const [sound, setSound] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");

  const titleToSearchKeyword = {
    "Rain Forest": "rainforest sounds",
    "Ocean Waves": "ocean wave sounds",
    "Mountain Stream": "stream water nature",
    "The Enchanted Forest": "fantasy ambient",
    "Journey to the Stars": "space ambient",
    "Peaceful Village": "calm village",
    "Piano Dreams": "soft piano music",
    "Healing Flute": "flute meditation",
    "Gentle Strings": "soft guitar melody",
  };

  async function fetchAudioUrl(query) {
    const API_KEY = 'ApKecoEW3uryvR61uzmcff51UcS2idtXRsBmsEfY';
    const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&fields=previews&token=${API_KEY}`;

    try {
      const response = await axios.get(url);
      const sounds = response.data.results;

      if (!sounds.length) {
        throw new Error(`No audio found for query: ${query}`);
      }

      return sounds[0].previews['preview-hq-mp3'];
    } catch (e) {
      console.log("Error fetching audio:", e);
      throw e;
    }
  }

  async function loadAndPlaySound() {
    try {
      const searchKeyword = titleToSearchKeyword[audio.title] || audio.title;
      const audioUrl = await fetchAudioUrl(searchKeyword);

      if (!audioUrl) {
        setError("No audio found for this title.");
        setIsLoading(false);
        return;
      }

      console.log('Loading Sound:', audioUrl);
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false }
      );
      setSound(sound);
      setIsLoading(false);
    } catch (e) {
      console.log('Error loading audio:', e);
      setError("Error loading audio.");
      setIsLoading(false);
    }
  }

  async function handlePlayPause() {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  }

  // Use useFocusEffect to stop the audio when leaving the screen
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound) {
          console.log('Stopping and Unloading Sound');
          sound.stopAsync().then(() => {
            sound.unloadAsync();
          });
        }
      };
    }, [sound])
  );

  useEffect(() => {
    loadAndPlaySound();

    return () => {
      if (sound) {
        console.log('Stopping and Unloading Sound');
        sound.stopAsync().then(() => {
          sound.unloadAsync();
        });
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: audio.image }} style={styles.image} />
      <Text style={styles.title}>{audio.title}</Text>
      <Text style={styles.duration}>{audio.duration}</Text>

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? (
        <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handlePlayPause}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isPlaying ? "Pause" : "Play"}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FF",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  image: {
    width: "90%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  duration: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
});
