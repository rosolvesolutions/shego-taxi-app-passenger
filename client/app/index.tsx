import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';

export default function UserSelectionPage() {
  const [fetchedValue, setFetchedValue] = useState<string | null>(null);

  useEffect(() => {
    const fetchValue = async () => {
      try {
        const response = await fetch(`${API_URL}/api/value`);
        const data = await response.json();
        setFetchedValue(data.value);
      } catch (error) {
        setFetchedValue('Server status: Offline');
        console.error('Error fetching data:', error);
      }
    };

    fetchValue();
  }, []);

  const ProgressDots = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressGroup}>
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <View style={step === 1 ? styles.activeDot : styles.inactiveDot}>
              <Text style={styles.dotText}>{step}</Text>
            </View>
            {step < 3 && <View style={styles.dotLine} />}
          </React.Fragment>
        ))}
      </View>
      <Text style={styles.stepText}>Step 1 of 3</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ProgressDots />

      <View style={styles.logoWrapper}>
        <Text style={styles.logoText}>SheGo</Text>
      </View>

      <Text style={styles.heading}>Welcome to SheGo</Text>
      <Text style={styles.subheading}>Your safe and empowering ride awaits.</Text>

      <View style={styles.middleSection}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.startText}>Start</Text>
        </TouchableOpacity>

        {fetchedValue && (
          <Text style={styles.backendStatus}>{fetchedValue}</Text>
        )}
      </View>

      <View style={styles.middleSection}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/request-ride')}
        >
          <Text style={styles.startText}>Book Ride</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.middleSection}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/log-in')}
        >
          <Text style={styles.startText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms & Conditions and Privacy Policy.
          {'\n'}© Rosolve Ltd.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCEEF1',
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 10,
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
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F7D5DD',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#982F46',
    textAlign: 'center',
    marginTop: 16,
  },
  subheading: {
    fontSize: 15,
    color: '#6D2A39',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  middleSection: {
    alignItems: 'center',
    width: '100%',
  },
  startButton: {
    backgroundColor: '#982F46',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  startText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backendStatus: {
    fontSize: 13,
    color: '#9E2A45',
    marginTop: 6,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
