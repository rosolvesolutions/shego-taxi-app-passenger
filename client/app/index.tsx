import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>SheGo</Text>
        </View>
        <Text style={styles.heading}>Welcome to SheGo</Text>
        <Text style={styles.subheading}>Your safe and empowering ride awaits.</Text>
      </View>

      {/* Start Button */}
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

      {/* Footer */}
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
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  topSection: {
    paddingTop: 60,
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9E2A45',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  middleSection: {
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#C73A53',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 12,
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
    backgroundColor: '#f9f9f9',
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
