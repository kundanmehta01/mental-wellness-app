import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // <-- Import AsyncStorage

export default function JournalScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState("");
  const [editingId, setEditingId] = useState(null);

  const STORAGE_KEY = "JOURNAL_ENTRIES"; // Storage key for AsyncStorage

  useEffect(() => {
    // Load entries from AsyncStorage on mount
    const loadEntries = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedEntries) {
          setEntries(JSON.parse(storedEntries));
        }
      } catch (error) {
        console.error("Failed to load entries:", error);
      }
    };
    loadEntries();
  }, []);

  useEffect(() => {
    // Save entries to AsyncStorage whenever they change
    const saveEntries = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      } catch (error) {
        console.error("Failed to save entries:", error);
      }
    };
    saveEntries();
  }, [entries]);

  const addEntry = () => {
    if (newEntry.trim()) {
      if (editingId) {
        // If editing, update the entry
        setEntries(prevEntries =>
          prevEntries.map(entry =>
            entry.id === editingId ? { ...entry, text: newEntry } : entry
          )
        );
        setEditingId(null);
      } else {
        // If new entry, add to list
        setEntries(prevEntries => [
          {
            id: Date.now(),
            text: newEntry,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
          },
          ...prevEntries,
        ]);
      }
      setNewEntry(""); // Clear input after saving
    }
  };

  const startEditing = (entry) => {
    setNewEntry(entry.text);
    setEditingId(entry.id); // Set entry ID for editing
  };

  const deleteEntry = (id) => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
            if (editingId === id) {
              setEditingId(null); // Clear editing if it's the one being deleted
              setNewEntry(""); // Clear the input
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gratitude Journal</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What are you grateful for today?"
          value={newEntry}
          onChangeText={setNewEntry}
          multiline
          numberOfLines={3}
        />
        <TouchableOpacity style={styles.addButton} onPress={addEntry}>
          <Ionicons name={editingId ? "checkmark-circle" : "add-circle"} size={24} color="white" />
          <Text style={styles.addButtonText}>
            {editingId ? "Save Changes" : "Add Entry"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.entriesList}>
        {entries.map(entry => (
          <View key={entry.id} style={styles.entryCard}>
            <Text style={styles.entryText}>{entry.text}</Text>
            <View style={styles.entryFooter}>
              <View>
                <Text style={styles.entryDate}>{entry.date}</Text>
                <Text style={styles.entryTime}>{entry.time}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => startEditing(entry)} style={styles.actionButton}>
                  <Ionicons name="create-outline" size={20} color="#6A5ACD" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteEntry(entry.id)} style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        {entries.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="journal-outline" size={48} color="#6A5ACD" />
            <Text style={styles.emptyStateText}>
              Start your gratitude journey today
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 16,
    color: "#333",
  },
  inputContainer: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  input: {
    backgroundColor: "#F8F8FF",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6A5ACD",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  entriesList: {
    flex: 1,
    padding: 16,
  },
  entryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  entryFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  entryDate: {
    fontSize: 12,
    color: "#666",
  },
  entryTime: {
    fontSize: 12,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
});
