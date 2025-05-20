import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';

export default function ProfileNameScreen() {
  const {
    firstName: paramFirstName = '',
    lastName: paramLastName = '',
    phoneNumber: paramPhoneNumber = '',
  } = useLocalSearchParams();

  const [firstName, setFirstName] = useState(paramFirstName);
  const [lastName, setLastName] = useState(paramLastName);
  const [email, setEmail] = useState('');
  const phoneNumber = paramPhoneNumber;

  const isValidEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const isFormValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    isValidEmail(email);

  const handleContinue = async () => {
    const userData = {
      firstName,
      lastName,
      email,
      phoneNumber,
    };

    try {
      const response = await fetch(`${API_URL}/api/passenger/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (response.ok && result.message?.toLowerCase().includes('success')) {
        Alert.alert('Signup successful!', result.message);
      } else {
        Alert.alert(
          'Signup warning',
          result.message || 'Could not verify success, proceeding anyway.'
        );
      }
    } catch (error) {
      console.error(error);
      console.warn('⚠️ Failed to send to backend. Proceeding anyway.');
    }

    router.push({
      pathname: '/index',
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.wrapper}>
          <Text style={styles.heading}>Welcome to SheGo 🎉</Text>
          <Text style={styles.subheading}>
            Please enter your details to complete your profile.
          </Text>

          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            placeholder="Jane"
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            placeholder="Doe"
            value={lastName}
            onChangeText={setLastName}
          />

          <Text style={styles.label}>Email (Gmail only)</Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[
              styles.continueButton,
              !isFormValid && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!isFormValid}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          All personal data is processed in line with GDPR and privacy best
          practices. By continuing, you agree to our Terms and Privacy Policy.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  wrapper: {
    paddingTop: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#222',
  },
  subheading: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 14,
    color: '#333',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
  continueButton: {
    marginTop: 32,
    backgroundColor: '#C73A53',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  continueText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 12,
    lineHeight: 18,
  },
});
