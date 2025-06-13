import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [error, setError] = useState('');

  const borderAnim = useRef(new Animated.Value(0)).current;

  const animateBorder = (toValue: number) =>
    Animated.timing(borderAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#DDD', '#9E2A45'],
  });

  const handleLogin = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/passenger/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.replace('/homepage');
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={styles.title}>Passenger Login</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <Animated.View style={[styles.inputWrapper, { borderColor }]}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. passenger@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => animateBorder(1)}
              onBlur={() => animateBorder(0)}
            />
          </Animated.View>

          <Text style={styles.label}>Password</Text>
          <Animated.View
            style={[
              styles.inputWrapper,
              { borderColor, flexDirection: 'row', alignItems: 'center' },
            ]}
          >
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={secureEntry}
              onFocus={() => animateBorder(1)}
              onBlur={() => animateBorder(0)}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setSecureEntry(!secureEntry)} style={{ padding: 8 }}>
              <Ionicons name={secureEntry ? 'eye-off' : 'eye'} size={20} color="#9E2A45" />
            </Pressable>
          </Animated.View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9E2A45',
    marginBottom: 24,
  },
  form: {
    width: '90%',
    maxWidth: 400,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  input: {
    padding: 12,
    backgroundColor: '#FFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#9E2A45',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  loginText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  error: {
    color: '#9E2A45',
    fontSize: 12,
    marginTop: -6,
    marginBottom: 10,
  },
});