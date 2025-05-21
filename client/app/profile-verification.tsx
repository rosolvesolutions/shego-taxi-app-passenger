import React from 'react';
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
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import cameraIcon from '../assets/images/camera.png';

export default function ProfileVerification(): JSX.Element {
  const { userData } = useLocalSearchParams();

  let user = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  try {
    if (userData) {
      user = JSON.parse(userData as string);
    }
  } catch (err) {
    console.warn('Invalid userData received in profile-verification:', err);
  }

  const userFullName = `${user.firstName} ${user.lastName}`.trim() || 'User';

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
      const imageUri = result.assets[0].uri;
      console.log('Captured Image URI:', imageUri);
      Alert.alert('Photo captured', 'Now send this to your OCR backend or process it.');
    }
  };

  const ProgressDots = ({ step }: { step: number }) => (
    <View style={styles.progressContainer}>
      <View style={styles.progressGroup}>
        {[1, 2, 3].map((num) => (
          <React.Fragment key={num}>
            <View style={step === num ? styles.activeDot : styles.inactiveDot}>
              <Text style={styles.dotText}>{num}</Text>
            </View>
            {num < 3 && <View style={styles.dotLine} />}
          </React.Fragment>
        ))}
      </View>
      <Text style={styles.stepText}>Step {step} of 3</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ProgressDots step={3} />

        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>SheGo</Text>
        </View>

        <Text style={styles.title}>
          Nice to meet you! We’re almost done.
        </Text>

        <Text style={styles.subHeading}>Account Verification*</Text>

        <TouchableOpacity style={styles.verifyButton} onPress={launchCamera}>
          <Text style={styles.verifyText}>Verify with passport</Text>
          <Image source={cameraIcon} style={styles.cameraIcon} />
        </TouchableOpacity>


        <Text style={styles.noteText}>
          *Verification is <Text style={styles.bold}>mandatory</Text> for account creation.
          If you cannot verify with the above methods, please contact us{' '}
          <Text style={styles.link}>here</Text> and we’ll do our best to help.
        </Text>

        <Text style={styles.footer}>
          All data collected is stored privately and only used to protect the safety of you and others. © Team Rosolve.
        </Text>
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
    marginTop: 40,
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
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  bold: {
    fontWeight: 'bold',
    color: '#982F46',
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
  link: {
    textDecorationLine: 'underline',
    fontWeight: '500',
    color: '#982F46',
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
});
