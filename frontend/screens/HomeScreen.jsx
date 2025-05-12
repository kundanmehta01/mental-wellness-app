import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { features } from "../data/FeaturesData";

const API_URL = 'http://192.168.29.208:5000';

const FeatureCard = ({ title, icon, description, onPress }) => (
  <TouchableOpacity style={styles.featureCard} onPress={onPress}>
    <LinearGradient
      colors={['#E6E6FA', '#F0F8FF']}
      style={styles.gradientBackground}
    >
      <Ionicons name={icon} size={32} color="#6A5ACD" />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation, route }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('HomeScreen: Fetching user, token:', token ? 'Present' : 'Not found');
      if (!token) {
        setError('No token found. Please log in again.');
        setUser(null);
        return;
      }

      const response = await axios.get(`${API_URL}/api/user/profile`, {
        headers: { 'x-auth-token': token },
        timeout: 10000,
      });
      console.log('HomeScreen: User fetched:', response.data);
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('HomeScreen: Fetch user error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to fetch user data.');
      setUser(null);
    }
  };

  useEffect(() => {
    console.log('HomeScreen: Mounted, params:', route.params);
    if (route.params?.updatedUser) {
      console.log('HomeScreen: Setting user from params:', route.params.updatedUser);
      setUser(route.params.updatedUser);
      setError(null);
      navigation.setParams({ updatedUser: null });
    } else {
      console.log('HomeScreen: No user in params, fetching...');
      fetchUser();
    }

    const unsubscribe = navigation.addListener('focus', () => {
      console.log('HomeScreen: Focused, params:', route.params);
      if (route.params?.updatedUser) {
        console.log('HomeScreen: Updating user from params:', route.params.updatedUser);
        setUser(route.params.updatedUser);
        setError(null);
        navigation.setParams({ updatedUser: null });
      } else {
        console.log('HomeScreen: No user in params on focus, fetching...');
        fetchUser();
      }
    });

    return unsubscribe;
  }, [navigation, route.params]);

  const handleLogout = async () => {
    try {
      console.log('HomeScreen: Logging out');
      await AsyncStorage.removeItem('token');
      setUser(null);
      setError(null);
      navigation.replace('Login');
    } catch (err) {
      console.error('HomeScreen: Logout error:', err);
      setError('Failed to log out.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{
              uri:
                "https://api.a0.dev/assets/image?text=peaceful%20meditation%20landscape%20with%20lotus%20minimal%20art&aspect=16:9"
            }}
            style={styles.headerImage}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Swasth Chittam</Text>
            <Text style={styles.slogan}>
              Breathing practice is the gateway to mental well-being
            </Text>
          </View>
        </View>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              onPress={() => navigation.navigate(feature.screen)}
            />
          ))}
        </View>

        {/* {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )} */}

        <View style={styles.footer}>
          {user ? (
            <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
          ) : (
            <Text style={styles.welcomeText}>Welcome</Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  headerTextContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  slogan: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  featureCard: {
    width: '45%',
    aspectRatio: 1,
    margin: 8,
    borderRadius: 15,
    overflow: 'hidden',
  },
  gradientBackground: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4A4A',
    marginTop: 10,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  logoutButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: 'white',
  },
  errorContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#D9534F',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});