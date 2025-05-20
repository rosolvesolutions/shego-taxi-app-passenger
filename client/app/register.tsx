import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextStyle,
  ViewStyle,
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

  return (
    <View style={styles.container}>
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
    </View>
  );
}

type Style = {
  [key: string]: ViewStyle | TextStyle;
};

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  logoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9E2A45',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitleWrapper: {
    marginBottom: 28,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  countryCode: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  countryText: {
    fontSize: 16,
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#C73A53',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  oauthButton: {
    backgroundColor: '#EDEDED',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
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
    position: 'absolute',
    bottom: 16,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
