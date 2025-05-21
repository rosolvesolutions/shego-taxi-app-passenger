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
import { router } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';

export default function RideRequestScreen() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');

  const isFormValid = pickupLocation.trim() !== '' && destination.trim() !== '';

  const handleRequestRide = async () => {
    const requestData = {
      pickupLocation,
      destination,
    };

    try {
      const response = await fetch(`${API_URL}/api/ride/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (response.ok && result.message) {
        Alert.alert('Ride Requested ✅', result.message);
        router.push('/index');
      } else {
        Alert.alert('Something went wrong', result.error || 'Please try again.');
      }
    } catch (error) {
      console.error('Error requesting ride:', error);
      Alert.alert('Network Error', 'Failed to contact server.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.wrapper}>
          <Text style={styles.heading}>Request a Ride 🛺</Text>
          <Text style={styles.subheading}>
            Enter your pickup and destination below.
          </Text>

          <Text style={styles.label}>Pickup Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 12 Main Street"
            value={pickupLocation}
            onChangeText={setPickupLocation}
          />

          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Airport Terminal 1"
            value={destination}
            onChangeText={setDestination}
          />

          <TouchableOpacity
            style={[
              styles.continueButton,
              !isFormValid && styles.disabledButton,
            ]}
            onPress={handleRequestRide}
            disabled={!isFormValid}
          >
            <Text style={styles.continueText}>Request Ride</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Our drivers are all background-checked and trained to ensure your safety.
          By requesting a ride, you agree to SheGo's Terms and Conditions.
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