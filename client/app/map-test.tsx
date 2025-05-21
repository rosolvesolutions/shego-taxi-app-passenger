import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, Alert, Button, SafeAreaView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';

export default function MapTest() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    let locationSubscription = null;

    const getLocationPermission = async () => {
      console.log("Requesting location permissions...");
      try {
        // Request foreground permission
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        
        if (foregroundStatus !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          Alert.alert(
            "Location Permission Required",
            "Please enable location permissions to see your current location on the map.",
            [{ text: "OK" }]
          );
          return;
        }
        
        console.log("Foreground permission granted, getting current position...");
        
        // Get initial location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest
        });
        
        console.log("Current location:", JSON.stringify(currentLocation));
        setLocation(currentLocation);
        
        // Center the map on the user's location
        if (mapRef.current && currentLocation) {
          mapRef.current.animateToRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }

        // Set up location tracking
        setIsTracking(true);
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            distanceInterval: 10, // Update if user moves by 10 meters
            timeInterval: 5000   // Or every 5 seconds
          },
          (newLocation) => {
            console.log("Location updated:", JSON.stringify(newLocation));
            setLocation(newLocation);
            
            // Optionally keep the map centered on the user as they move
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }, 1000);
            }
          }
        );

      } catch (error) {
        console.error("Error getting location:", error);
        setErrorMsg('Error getting location: ' + (error.message || 'Unknown error'));
        Alert.alert("Location Error", error.message || 'Unknown error');
      }
    };

    getLocationPermission();

    // Cleanup function
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const recenterMap = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Map Test",
        }}
      />
      <Text style={styles.text}>Map Test Page</Text>
      
      <View style={styles.mapContainer}>
        <MapView 
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
          initialRegion={{
            latitude: 37.78825, // Default location (San Francisco)
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
              description="Your current location"
            />
          )}
        </MapView>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Find My Location" onPress={recenterMap} />
      </View>
      
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : !location ? (
        <Text style={styles.loadingText}>Finding your location...</Text>
      ) : (
        <Text style={styles.locationText}>
          Lat: {location.coords.latitude.toFixed(6)}, Lng: {location.coords.longitude.toFixed(6)}
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  mapContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.6,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    marginBottom: 15,
  },
  errorText: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
    padding: 10,
  },
  loadingText: {
    marginTop: 10,
    color: 'gray',
    textAlign: 'center',
  },
  locationText: {
    marginTop: 10,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});