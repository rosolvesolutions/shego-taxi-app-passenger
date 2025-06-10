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

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.20.10.4:8080';

export default function RideRequestScreen() {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [rideStatus, setRideStatus] = useState('');
  type DriverInfo = {
    name: string;
    vehicle: string;
    plate: string;
    phone: string;
  };
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);

  const isFormValid = pickupAddress.trim() !== '' && dropoffAddress.trim() !== '';

  const handleRequestRide = async () => {
    const dummyPickupCoords = [-0.1257, 51.5085];
    const dummyDropoffCoords = [-0.1426, 51.5010];

    const requestData = {
      passengerId: '645f3b1a9f1b2c0012345672',
      driverId: null,
      pickupLocation: {
        type: 'Point',
        coordinates: dummyPickupCoords,
        address: pickupAddress,
      },
      dropoffLocation: {
        type: 'Point',
        coordinates: dummyDropoffCoords,
        address: dropoffAddress,
      },
      fare: 25.75,
      status: 'pending',
      paymentMethod: 'credit_card',
      requestedAt: new Date().toISOString(),
      distanceKm: 4.8,
      durationMinutes: 25,
    };

    try {
      const response = await fetch(`${API_URL}/api/booking/request`, {
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
        pollBookingStatus(); // 🔁 start polling for status updates
      } else {
        Alert.alert('Something went wrong', result.error || 'Please try again.');
      }
    } catch (error) {
      console.error('Error requesting ride:', error);
      Alert.alert('Network Error', 'Failed to contact server.');
    }
  };

const pollBookingStatus = () => {
  const interval = setInterval(async () => {
    try {
      console.log("about to hit!")
      const res = await fetch(`http://172.20.10.4:8080/api/booking/status/645f3b1a9f1b2c0012345672`);
      console.log("hit! :)")
      
      if (!res.ok) {
        console.warn('Backend responded with error, will retry...');
        return; // do nothing, keep polling
      }

      const data = await res.json();

      if (data.status === 'accepted') {
        clearInterval(interval); // stop polling once driver is found
        setRideStatus('accepted');
        setDriverInfo(data.driver);
        Alert.alert('Driver Accepted ✅', 'Your driver is on the way!');
      }
    } catch (err) {
      console.warn('Polling failed, retrying...' + err);
      // don't stop polling — just continue
    }
  }, 2000); // poll every 2 seconds
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
            placeholder="e.g., 10 Downing Street"
            value={pickupAddress}
            onChangeText={setPickupAddress}
          />

          <Text style={styles.label}>Dropoff Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Buckingham Palace"
            value={dropoffAddress}
            onChangeText={setDropoffAddress}
          />

          <TouchableOpacity
            style={[styles.continueButton, !isFormValid && styles.disabledButton]}
            onPress={handleRequestRide}
            disabled={!isFormValid}
          >
            <Text style={styles.continueText}>Request Ride</Text>
          </TouchableOpacity>

          {rideStatus === 'accepted' && (
            <>
              <Text style={styles.acceptedText}>
                ✅ A driver has accepted your ride and is on the way!
              </Text>
              {driverInfo && (
                <View style={styles.driverCard}>
                  <Text style={styles.driverTitle}>Driver Details</Text>
                  <Text>Name: {driverInfo.name}</Text>
                  <Text>Vehicle: {driverInfo.vehicle}</Text>
                  <Text>Plate: {driverInfo.plate}</Text>
                  <Text>Phone: {driverInfo.phone}</Text>
                  <Text style={styles.arrivalNote}>
                    🚗 Your driver is arriving shortly!
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        <Text style={styles.footer}>
          Our drivers are all background-checked and trained to ensure your safety.
          By requesting a ride, you agree to SheGo&apos;s Terms and Conditions.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FCEEF1',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  wrapper: {
    paddingTop: 60,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#982F46',
  },
  subheading: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6D2A39',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 14,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  continueButton: {
    marginTop: 32,
    backgroundColor: '#982F46',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  continueText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  acceptedText: {
    color: '#228B22',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  driverCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  driverTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  arrivalNote: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#228B22',
  },
  footer: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 12,
    lineHeight: 18,
  },
});
