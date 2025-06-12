// client/app/homepage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView, Alert } from 'react-native'; //removed TextInput to pass lint test
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Animated, Pressable } from 'react-native';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from '@env';

// Type definitions for react-native-maps components
interface MapViewProps {
  style?: object;
  provider?: string;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  showsUserLocation?: boolean;
  followsUserLocation?: boolean;
  scrollEnabled?: boolean;
  zoomEnabled?: boolean;
  pitchEnabled?: boolean;
  rotateEnabled?: boolean;
  zoomTapEnabled?: boolean;
  zoomControlEnabled?: boolean;
  showsCompass?: boolean;
  showsMyLocationButton?: boolean;
  mapType?: 'standard' | 'satellite' | 'hybrid' | 'terrain';
  children?: React.ReactNode;
}

interface MarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title?: string;
  description?: string;
}

interface MapViewMethods {
  animateToRegion: (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }, duration?: number) => void;
}

type MapViewComponent = React.ComponentType<MapViewProps> & {
  prototype: MapViewMethods;
};
type MarkerComponent = React.ComponentType<MarkerProps>;

// Default location (you can adjust this to your preferred default)
const DEFAULT_LOCATION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

// Home page screen
export default function HomePage() {
  // Map components state
  const [MapView, setMapView] = useState<MapViewComponent | null>(null);
  const [Marker, setMarker] = useState<MarkerComponent | null>(null);
  const [PROVIDER_GOOGLE, setProviderGoogle] = useState<string | null>(null);
  
  // Map and location state
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  // errorMsg variable was deleted to pass lint error
  const [, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapViewMethods | null>(null);

  //Toggle Menu 
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current; // start off-screen

  // Load map components dynamically on native platforms
  useEffect(() => {
    if (Platform.OS !== 'web') {
      import('react-native-maps').then((Maps) => {
        setMapView(() => Maps.default as MapViewComponent);
        setMarker(() => Maps.Marker as MarkerComponent);
        setProviderGoogle(() => Maps.PROVIDER_GOOGLE as string);
      }).catch((error) => {
        console.error('Failed to load react-native-maps:', error);
      });
    }
  }, []);

  // Add this in your component (remove after testing)
  useEffect(() => {
    console.log('API Key loaded:', GOOGLE_MAPS_API_KEY ? 'Yes' : 'No');
    console.log('API Key first 10 chars:', GOOGLE_MAPS_API_KEY?.substring(0, 10));
    console.log('API Key length:', GOOGLE_MAPS_API_KEY?.length);
  }, []);

  useEffect(() => {
    console.log('Current API Key:', GOOGLE_MAPS_API_KEY);
    console.log('Is it fake?', GOOGLE_MAPS_API_KEY === 'fake_key_test');
  }, []);

  const openMenu = () => {
    console.log('Opening menu....')
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setMenuVisible(false);
    });
  };

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Setup location tracking with improved implementation from App.js
  useEffect(() => {
    // Skip location tracking on web
    if (Platform.OS === 'web') {
      console.log("Location tracking skipped on web platform");
      return;
    }

    let locationSubscription: Location.LocationSubscription | null = null;

    const getLocationPermission = async () => {
      console.log("Requesting location permissions...");
      try {
        // Request foreground permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          Alert.alert(
            "Location Permission Required",
            "Please enable location permissions to see your current location on the map.",
            [{ text: "OK" }]
          );
          return;
        }
        
        console.log("Foreground permission granted, getting current position...");
        
        // Get initial location with high accuracy
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest
        });
        
        console.log("Current location:", JSON.stringify(currentLocation.coords));
        setLocation(currentLocation.coords);
        
        // Center the map on the user's location
        if (mapRef.current && currentLocation) {
          mapRef.current.animateToRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }, 1000);
        }

        // Set up location tracking
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10, // Update if user moves by 10 meters
            timeInterval: 5000   // Or every 5 seconds
          },
          (newLocation) => {
            console.log("Location updated:", JSON.stringify(newLocation.coords));
            setLocation(newLocation.coords);
            
            // Keep the map centered on the user as they move
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }, 1000);
            }
          }
        );

      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error getting location:", error);
          setErrorMsg(`Error getting location: ${error.message}`);
          Alert.alert("Location Error", error.message);
        } else {
          console.error("Unknown error", error);
          Alert.alert("Location Error", "An unknown error occurred");
        }
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
  
  // Function to recenter map on user's location
  const recenterMap = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, position: 'relative' }}>

      {/* Live location-tracking map using Expo Location and react-native-maps */}
      <View style={{ flex: 1, minHeight: 300 }}>
        {Platform.OS !== 'web' && MapView && Marker ? (
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE || undefined}
            initialRegion={location ? {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            } : DEFAULT_LOCATION}
            showsUserLocation={true}
            followsUserLocation={false}  // Changed to false to allow manual interaction
            // Interaction props:
            scrollEnabled={true}         // Enables panning/scrolling
            zoomEnabled={true}           // Enables pinch to zoom
            pitchEnabled={true}          // Enables tilting the map
            rotateEnabled={true}         // Enables rotation
            zoomTapEnabled={true}        // Enables double-tap to zoom
            zoomControlEnabled={false}   // Disable zoom controls (optional)
            showsCompass={true}          // Shows compass control
            showsMyLocationButton={false} // We have our own recenter button
            mapType='standard'
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="You are here"
                description="Current location"
              />
            )}
          </MapView>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Map view is not available on web</Text>
            <Text style={styles.placeholderSubtext}>Please use the mobile app for map features</Text>
          </View>
        )}
      </View>

      {/* Recenter Button - Only show on native platforms */}
      {Platform.OS !== 'web' && location && (
        <TouchableOpacity 
          style={styles.recenterButton} 
          onPress={recenterMap}
        >
          <Ionicons name="locate" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Top-left hamburger menu icon */}
      <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
        <FontAwesome5 name="bars" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Blurred overlay for enhanced contrast */}
      <View style={styles.overlay} pointerEvents='none' />

      {/* Centered "Where to?" button */}
      <TouchableOpacity style={styles.whereToButton} onPress={() => router.push('/request-ride')}>
        <Text style={styles.whereToText}>Where to?</Text>
      </TouchableOpacity>

      {/* Bottom navigation bar with icons */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/homepage')}>
          <Ionicons name="home-outline" size={22} color="white" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={22} color="white" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Ionicons name="person-outline" size={22} color="white" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
      
      {/* Menu Backdrop - only visible when menu is open */}
      {menuVisible && <Pressable style={styles.menuBackdrop} onPress={closeMenu} />}

      {/* Always render the menu, slide it in/out */}
      <Animated.View style={[styles.sideMenu, { left: slideAnim }]}>
        <Text style={styles.menuTitle}>Menu</Text>

        <TouchableOpacity onPress={() => {
          closeMenu();
          router.push('../profile');
        }}>
          <Text style={styles.menuItem}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          closeMenu();
          router.push('../settings');
        }}>
          <Text style={styles.menuItem}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={closeMenu}>
          <Text style={[styles.menuItem, { color: '#ccc' }]}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// Modern, polished styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  menuButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    backgroundColor: 'rgba(92,26,39,0.85)',
    padding: 14,
    borderRadius: 18,
    zIndex: 99,
    elevation: 8,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 150,
    right: 20,
    backgroundColor: 'rgba(92,26,39,0.85)',
    padding: 14,
    borderRadius: 30,
    zIndex: 90,
    elevation: 8,
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholderSubtext: {
    color: '#999',
    fontSize: 14,
    marginTop: 10,
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999, // less than sideMenu
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#5C1A27',
    paddingTop: 80,
    paddingHorizontal: 20,
    zIndex: 1000, // forces it above the backdrop
    elevation: 100,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  menuItem: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 10,
  },
  greetingContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 10,
    left: 20,
    zIndex: 90,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  whereToButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(92,26,39,0.92)', // chocolate-burgundy tint
    paddingVertical: 18,
    paddingHorizontal: 55,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  whereToText: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(92, 26, 39, 0.92)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});