import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import googleIcon from '../assets/images/google.png';
import facebookIcon from '../assets/images/facebook.png';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterPage(): JSX.Element {
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [, googleResponse, promptGoogle] = Google.useAuthRequest({
    expoClientId: '73401594138-9ok57i91m84qpmka3l3b88ujvg4r38h4.apps.googleusercontent.com',
    iosClientId: '<your-ios-client-id>',
    androidClientId: '<your-android-client-id>',
    webClientId: '73401594138-bimcri6eg34klc2v3hiobmqdvu2el671.apps.googleusercontent.com',
    responseType: 'id_token',
    scopes: ['profile', 'email'],
  });

  const [, fbResponse, promptFacebook] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID',
  });

  const handlePhoneInput = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    setPhoneNumber(digitsOnly);
  };

  const isPhoneValid = (number: string) => {
    let formatted = number;
    if (formatted.startsWith('0')) {
      formatted = formatted.substring(1);
    }
    const irishPhoneRegex = /^8[3-9][0-9]{7}$/;
    return irishPhoneRegex.test(formatted);
  };

  const handleCreateAccount = () => {
    if (isPhoneValid(phoneNumber)) {
      router.push({
        pathname: '/VertificationPage',
        params: { phoneNumber },
      });
    } else {
      alert('Please enter a valid Irish mobile number');
    }
  };

  const handleGoogleLogin = async () => {
    if (!isPhoneValid(phoneNumber)) {
      alert('Please enter a valid Irish phone number before logging in with Google.');
      return;
    }

    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${googleResponse?.authentication?.accessToken}`,
        },
      });
      const user = await res.json();
      const [first, last] = user.name.split(' ');

      router.push({
        pathname: '/passenger-side/profile-name',
        params: { firstName: first, lastName: last, phoneNumber },
      });
    } catch (error) {
      console.error(error);
      alert('Google login failed.');
    }
  };

  const handleFacebookLogin = async () => {
    if (!isPhoneValid(phoneNumber)) {
      alert('Please enter a valid Irish phone number before logging in with Facebook.');
      return;
    }

    try {
      const token = fbResponse?.authentication?.accessToken;
      const res = await fetch(`https://graph.facebook.com/me?fields=name&access_token=${token}`);
      const user = await res.json();
      const [first, last] = user.name.split(' ');

      router.push({
        pathname: '/passenger-side/profile-name',
        params: { firstName: first, lastName: last, phoneNumber },
      });
    } catch (error) {
      console.error(error);
      alert('Facebook login failed.');
    }
  };

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      handleGoogleLogin();
    }
  }, [googleResponse]);

  useEffect(() => {
    if (fbResponse?.type === 'success') {
      handleFacebookLogin();
    }
  }, [fbResponse]);

  const ProgressDots = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressGroup}>
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <View style={step === 2 ? styles.activeDot : styles.inactiveDot}>
              <Text style={styles.dotText}>{step}</Text>
            </View>
            {step < 3 && <View style={styles.dotLine} />}
          </React.Fragment>
        ))}
      </View>
      <Text style={styles.stepText}>Step 2 of 3</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <ProgressDots />

        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>SheGo</Text>
        </View>

        <Text style={styles.title}>Create your SheGo account</Text>

        <View style={styles.subtitleWrapper}>
          <Text style={styles.subtitle}>
            Enter your Irish mobile number or sign in using Google or Facebook to continue.
          </Text>
        </View>

        <View style={styles.phoneInputContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.countryText}>🇮🇪 +353</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="858446755"
            keyboardType="number-pad"
            value={phoneNumber}
            onChangeText={handlePhoneInput}
          />
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount}>
          <Text style={styles.createButtonText}>Create account</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity
          style={styles.oauthButton}
          onPress={() => {
            if (promptGoogle) promptGoogle();
            else alert('Google login is not ready yet.');
          }}
        >
          <View style={styles.oauthContent}>
            <Image source={googleIcon} style={styles.oauthIcon} />
            <Text style={styles.oauthText}>Log in with Google</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.oauthButton} onPress={() => promptFacebook()}>
          <View style={styles.oauthContent}>
            <Image source={facebookIcon} style={styles.oauthIcon} />
            <Text style={styles.oauthText}>Log in with Facebook</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Terms & Conditions apply. By continuing, you agree to our Privacy Policy and User Agreement.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: '#FCEEF1',
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 100,
  },
  progressContainer: {
    alignItems: 'center',
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
    fontSize: 24,
    fontWeight: '700',
    color: '#982F46',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitleWrapper: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#6D2A39',
    textAlign: 'center',
    lineHeight: 22,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  countryCode: {
    backgroundColor: '#F8E7EA',
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  countryText: {
    fontSize: 16,
    color: '#982F46',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#982F46',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  oauthButton: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  oauthContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  oauthIcon: {
    position: 'absolute',
    left: 16,
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  oauthText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
});
