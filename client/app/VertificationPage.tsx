import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import cameraIcon from '../assets/images/camera.png';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';

export default function VerificationPage(): JSX.Element {
  const { phoneNumber, email, city } = useLocalSearchParams();
  const router = useRouter();

  const userInfo = phoneNumber || email || 'User';
  const [imageUri, setImageUri] = useState<string | null>(null);

  const launchCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera access is required for verification.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      Alert.alert('Photo captured', 'Preview your photo below.');
    }
  };

  const resetVerification = () => {
    setImageUri(null);
  };

  const extractGenderFromMRZ = (mrzLine: string): string | null => {
    const cleaned = mrzLine.replace(/[^A-Z0-9<]/gi, '').replace(/\s+/g, '');
    const match = cleaned.match(/([0-9]{7})([MF<])/);
    return match?.[2] === 'F' || match?.[2] === 'M' ? match[2] : null;
  };

  const uploadImageForOCR = async () => {
    if (!imageUri) return;

    try {
      const manipulated = await ImageManipulator.manipulateAsync(imageUri, [], {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      const formData = new FormData();
      formData.append('image', {
        uri: manipulated.uri,
        type: 'image/jpeg',
        name: 'passport.jpg',
      } as unknown as Blob);

      const response = await fetch(`${API_BASE_URL}/api/vision/ocr`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const mrz = data.mrzLines?.[1] || '';
        const genderChar = extractGenderFromMRZ(mrz);

        if (genderChar === 'F') {
          Alert.alert('OCR Completed', data.mrzLines?.join('\n') || 'No MRZ lines found.');
          router.push({
            pathname: '/profile-name',
            params: { phoneNumber, email, city },
          });
        } else if (genderChar === 'M') {
          Alert.alert('Access Denied', 'Only female drivers are allowed to register.');
        } else {
          Alert.alert('Unclear Gender Info', 'Could not detect gender from passport.');
        }
      } else {
        Alert.alert('OCR Failed', data.error || 'Unknown error');
      }
    } catch (err: unknown) {
      console.error('❌ Upload Error:', err);
      Alert.alert('Upload Error', err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const ProgressDots = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressGroup}>
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <View style={step === 3 ? styles.activeDot : styles.inactiveDot}>
              <Text style={styles.dotText}>{step}</Text>
            </View>
            {step < 3 && <View style={styles.dotLine} />}
          </React.Fragment>
        ))}
      </View>
      <Text style={styles.stepText}>Step 3 of 3</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ProgressDots />

        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>SheGo</Text>
        </View>

        <Text style={styles.title}>
          Let’s complete your verification.
        </Text>

        <Text style={styles.userDetails}>
          Phone: {phoneNumber}{'\n'}
        </Text>

        {!imageUri ? (
          <>
            <Text style={styles.subHeading}>Account Verification*</Text>

            <TouchableOpacity style={styles.verifyButton} onPress={launchCamera}>
              <Text style={styles.verifyText}>Verify with passport</Text>
              <Image source={cameraIcon} style={styles.cameraIcon} />
            </TouchableOpacity>

            <Text style={styles.noteText}>
              *Verification is <Text style={styles.bold}>mandatory</Text> for account creation.
            </Text>

            <Text style={styles.footer}>
              All data collected is stored privately and only used to protect the safety of you and others. © Team Rosolve.
            </Text>
          </>
        ) : (
          <View style={styles.previewContainer}>
            <Text style={styles.subHeading}>Passport Photo Preview</Text>
            <Image source={{ uri: imageUri }} style={styles.capturedImage} />

            <TouchableOpacity style={styles.uploadButton} onPress={uploadImageForOCR}>
              <Text style={styles.uploadButtonText}>Upload for OCR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={resetVerification}>
              <Text style={styles.resetButtonText}>Retake Photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FCEEF1',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  progressGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  activeDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#982F46',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dotLine: {
    width: 20,
    height: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  stepText: {
    fontSize: 13,
    color: '#982F46',
    fontWeight: '500',
  },
  logoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F7D5DD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#982F46',
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
    color: '#982F46',
  },
  userDetails: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  subHeading: {
    fontSize: 14,
    color: '#6D2A39',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  verifyButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 18,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  verifyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
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
    textAlign: 'left',
  },
  footer: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 24,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  capturedImage: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
    borderRadius: 12,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#E53935',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
