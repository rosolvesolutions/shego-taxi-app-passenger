import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.topSection}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>SheGo</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.heading}>Welcome to SheGo</Text>
          <Text style={styles.subheading}>Your safe and empowering ride awaits.</Text>

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
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
            SheGo is operated by Rosolve Ltd. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    backgroundColor: '#9E2A45',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9E2A45',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  subheading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#C73A53',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
  },
  startText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backendStatus: {
    fontSize: 13,
    color: '#9E2A45',
    marginTop: 10,
    fontWeight: '500',
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#eee',
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    textAlign: 'center',
  },
});
