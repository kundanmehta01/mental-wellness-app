import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://192.168.29.208:5000';

export default function ProfileScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('ProfileScreen: Token on load:', token ? 'Present' : 'Not found');
        if (token) {
          const response = await axios.get(`${API_URL}/api/user/profile`, {
            headers: { 'x-auth-token': token },
          });
          console.log('ProfileScreen: Loaded user:', response.data);
          setUser(response.data);
          setName(response.data.name);
        }
      } catch (err) {
        console.error('ProfileScreen: Load user error:', err.response?.data || err.message);
      }
    };
    loadUser();
  }, []);

  const handleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        console.log('ProfileScreen: Logging in with:', { email });
        const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        const { token } = response.data;
        console.log('ProfileScreen: Token saved:', token);
        await AsyncStorage.setItem('token', token);

        const profileResponse = await axios.get(`${API_URL}/api/user/profile`, {
          headers: { 'x-auth-token': token },
        });
        console.log('ProfileScreen: Profile fetched:', profileResponse.data);
        setUser(profileResponse.data);
        setName(profileResponse.data.name);

        // Navigate to HomeScreen with user data
        navigation.navigate('Home', { updatedUser: profileResponse.data });

        setEmail('');
        setPassword('');
      } else {
        console.log('ProfileScreen: Signing up with:', { name, email });
        await axios.post(`${API_URL}/api/auth/signup`, { name, email, password });
        setIsLogin(true);
        setError('Signup successful! Please login.');
        setEmail('');
        setPassword('');
        setName('');
      }
    } catch (err) {
      console.error('ProfileScreen: Auth error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('No token found');
        return;
      }

      console.log('ProfileScreen: Updating profile with name:', name);
      const formData = new FormData();
      formData.append('name', name);

      const response = await axios.put(`${API_URL}/api/user/profile`, formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser((prev) => ({ ...prev, name }));
      setError('Profile updated successfully');
      setIsEditing(false);

      // Navigate to HomeScreen with updated user data
      navigation.navigate('Home', { updatedUser: { ...user, name } });
    } catch (err) {
      console.error('ProfileScreen: Update profile error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to update profile');
    }
  };

  const handlePhotoUpload = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      setError('No token found');
      return;
    }
    try {
      console.log('ProfileScreen: Uploading photo');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setError('Photo library permission denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.canceled) {
        setError('Image selection cancelled');
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append('profilePhoto', {
        uri: result.assets[0].uri,
        type: result.assets[0].mimeType || 'image/jpeg',
        name: result.assets[0].fileName || 'profile.jpg',
      });

      const uploadResponse = await axios.put(`${API_URL}/api/user/profile`, formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      setUser((prev) => ({ ...prev, profilePhoto: uploadResponse.data.profilePhoto }));
      setError('Profile photo updated');

      // Navigate to HomeScreen with updated user data
      navigation.navigate('Home', { updatedUser: { ...user, profilePhoto: uploadResponse.data.profilePhoto } });
    } catch (err) {
      console.error('ProfileScreen: Photo upload error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('ProfileScreen: Logging out');
      await AsyncStorage.removeItem('token');
      setUser(null);
      setEmail('');
      setPassword('');
      setName('');
      setError('');
      navigation.replace('Login');
    } catch (err) {
      console.error('ProfileScreen: Logout error:', err);
      setError('Failed to log out');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {user ? (
          <>
            <TouchableOpacity
              onPress={() => handlePhotoUpload()}
              activeOpacity={0.7}
            >
              <View>
                <Image
                  source={{
                    uri: user.profilePhoto
                      ? `${API_URL}/uploads/${user.profilePhoto}`
                      : 'https://via.placeholder.com/150',
                  }}
                  style={styles.avatar}
                />
                {!user.profilePhoto && (
                  <View style={styles.addPhotoOverlay}>
                    <Ionicons name="add" size={24} color="white" />
                  </View>
                )}
                {user.profilePhoto && isEditing && (
                  <View style={styles.addPhotoOverlay}>
                    <Ionicons name="camera" size={24} color="white" />
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.infoContainer}>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                />
              ) : (
                <Text style={styles.nameText}>{user.name}</Text>
              )}

              <Text style={styles.emailText}>{user.email}</Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {isEditing ? (
              <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
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

            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleAuth}>
              <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.toggleText}>
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
              </Text>
            </TouchableOpacity>
          </>
        )}
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
    alignItems: 'center',
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
  headerTextContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#6A5ACD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  addPhotoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  nameText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 18,
    color: '#777',
    marginTop: 5,
  },
  input: {
    width: '100%',
    maxWidth: 350,
    height: 50,
    borderColor: '#6A5ACD',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    marginVertical: 12,
    color: '#333',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    backgroundColor: '#6A5ACD',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 12,
    shadowColor: '#6A5ACD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  toggleText: {
    color: '#6A5ACD',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutText: {
    color: '#D9534F',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#D9534F',
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});