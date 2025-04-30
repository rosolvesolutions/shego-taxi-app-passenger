import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle,
  Image,
  Alert,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import cameraIcon from '../assets/images/camera.png'

export default function ProfileVerification(): JSX.Element {
  const { userData } = useLocalSearchParams()

  let user = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  }

  try {
    if (userData) {
      user = JSON.parse(userData as string)
    }
  } catch (err) {
    console.warn('Invalid userData received in profile-verification:', err)
  }

  const userFullName = `${user.firstName} ${user.lastName}`.trim() || 'User'

  const launchCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera access is required for verification.')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    })

    if (!result.canceled) {
      const imageUri = result.assets[0].uri
      console.log('Captured Image URI:', imageUri)
      Alert.alert('Photo captured', 'Now send this to your OCR backend or process it.')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Nice to meet you, <Text style={styles.bold}>{userFullName}</Text>! We’re almost done with setting up.
      </Text>

      <Text style={styles.subHeading}>Account Verification*</Text>

      <TouchableOpacity style={styles.verifyButton} onPress={launchCamera}>
        <Text style={styles.verifyText}>Verify with passport</Text>
        <Image source={cameraIcon} style={styles.cameraIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.verifyButton} onPress={launchCamera}>
        <Text style={styles.verifyText}>Verify with ID card</Text>
        <Image source={cameraIcon} style={styles.cameraIcon} />
      </TouchableOpacity>

      <Text style={styles.noteText}>
        *Verification is <Text style={styles.bold}>mandatory</Text> for account creation. If you cannot verify with the above methods please contact us <Text style={styles.link}>here</Text> and we’ll do our best to help.
      </Text>

      <Text style={styles.footer}>
        All data collected is stored privately and only used to protect the safety of you and others. © Team Rosolve.
      </Text>
    </View>
  )
}


type Style = {
  [key: string]: ViewStyle | TextStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 16,
    marginBottom: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: 14,
    marginBottom: 16,
  },
  verifyButton: {
    backgroundColor: '#E6E6E6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 18,
  },
  verifyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cameraIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  noteText: {
    fontSize: 12,
    color: '#333',
    marginTop: 10,
    marginBottom: 24,
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  footer: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 24,
    alignSelf: 'center',
    width: '90%',
  },
})
