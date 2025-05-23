import React, { useState } from 'react'
// there was a view here but was omitted to pass git actions
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'

export default function ProfileNameScreen() {
  const {
    firstName: paramFirstName = '',
    lastName: paramLastName = '',
    phoneNumber: paramPhoneNumber = '',
  } = useLocalSearchParams()

  const [firstName, setFirstName] = useState(paramFirstName)
  const [lastName, setLastName] = useState(paramLastName)
  const [email, setEmail] = useState('')
  const phoneNumber = paramPhoneNumber

  const isValidEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)

  const isFormValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    isValidEmail(email)

  const handleContinue = async () => {
    const userData = {
      firstName,
      lastName,
      email,
      phoneNumber,
    }

    try {
      const response = await fetch('http://10.156.26.109:5001/api/passenger/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()
      console.log('Server response:', result)

      if (response.ok && result.message?.toLowerCase().includes('success')) {
        Alert.alert('Signup successful!', result.message, [
          {
            text: 'OK',
            onPress: () => {
              router.push({
                pathname: '/passenger-side/profile-verification',
                params: {
                  userData: JSON.stringify(userData),
                },
              })
            },
          },
        ])
      } else {
        Alert.alert('Signup failed', result.message || 'Something went wrong.')
      }
      
    } catch (error) {
      console.error('Error sending to backend:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>
          Thank you for signing up!{'\n'}
          <Text style={styles.bold}>Please tell us your name to continue.</Text>
        </Text>

        <Text style={styles.label}>Your first name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Jane"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Your last name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Doe"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Your email (Gmail only):</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.continueButton, !isFormValid && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!isFormValid}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          All data collected is stored privately and only used to protect the safety of you and others. © Team Rosolve.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  bold: {
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#E6E6E6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  continueButton: {
    marginTop: 28,
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
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
})
