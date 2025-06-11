// client/app/homepage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView, TextInput, Alert } from 'react-native'; 
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Animated, Pressable } from 'react-native';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from '@env';

// Conditional imports for native platforms only
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

// Default location (you can adjust this to your preferred default)
const DEFAULT_LOCATION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

// Home page screen
export default function HomePage() {
  // Map and location state
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  // errorMsg variable was deleted to pass lint error
  const [, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<any>(null); // Changed from MapView to any

  // Where to button
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');

  //Toggle Menu 
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current; // start off-screen

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
  
  // Searchbar
  const handleSearch = (query: string) => {
    console.log('User searched:', query);
    setSearchActive(false);
    setSearchText('');
  };

  // User greeting
  const [greeting, setGreeting] = useState('');
  const userName = 'Midas'; // Replace with dynamic value later

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

      } catch (error: any) {
        console.error("Error getting location:", error);
        setErrorMsg(`Error getting location: ${error}`);
        Alert.alert("Location Error", error.message || "Unknown error occurred");
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
  
  // Location options for search
  const recentPlaces = ['📍 123 Oxford Street', '📍 Home', '📍 Starbucks - Camden'];
  const smartSuggestions = ['🏢 Work', '🏋️ Gym', '🛒 Grocery Store'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, position: 'relative' }}>

      {/* Live location-tracking map using Expo Location and react-native-maps */}
      <View style={{ flex: 1, minHeight: 300 }}>
        {Platform.OS !== 'web' && MapView ? (
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
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

      {/* Greeting */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>
          {greeting}, {userName} <Text style={{ fontSize: 20 }}>👋</Text>
        </Text>
      </View>

      {/* Top-left hamburger menu icon */}
      <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
        <FontAwesome5 name="bars" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Blurred overlay for enhanced contrast */}
      <View style={styles.overlay} pointerEvents='none' />

      {/* Centered "Where to?" button */}
      {!searchActive ? (
        <TouchableOpacity style={styles.whereToButton} onPress={() => setSearchActive(true)}>
          <Text style={styles.whereToText}>Where to?</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search destination..."
            placeholderTextColor="#ccc"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => handleSearch(searchText)}
            autoFocus
          />
          <TouchableOpacity onPress={() => {
            setSearchText('');
            setSearchActive(false);
          }}>
            <Ionicons name="close-circle" size={22} color="#fff" style={styles.clearIcon} />
          </TouchableOpacity>
        </View>
      )}

      {/* Suggestions List */}
      {searchActive && (
        <View style={styles.suggestionsContainer}>
          {searchText === '' && (
            <>
              <Text style={styles.suggestionHeading}>Recent</Text>
              {recentPlaces.map((place, index) => (
                <TouchableOpacity key={index} style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{place}</Text>
                </TouchableOpacity>
              ))}
              <Text style={styles.suggestionHeading}>Suggestions</Text>
              {smartSuggestions.map((place, index) => (
                <TouchableOpacity key={index} style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{place}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      )}

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
  mapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.95,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    pointerEvents: 'none',
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
  greetingSub: {
    fontSize: 14,
    color: '#f0e0e0',
    marginTop: 4,
    fontStyle: 'italic',
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
  searchBarContainer: {
    position: 'absolute',
    top: '42%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(92,26,39,0.9)',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 2,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '52%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    width: '80%',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 50,
  },
  quickActionsContainer: {
    position: 'absolute',
    top: '65%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '90%',
    gap: 10,
  },
  quickCard: {
    backgroundColor: 'rgba(92,26,39,0.9)',
    width: '47%',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  quickEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  quickLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  suggestionHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  suggestionItem: {
    paddingVertical: 6,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 15,
    color: '#444',
  },
  clearIcon: {
    marginLeft: 10,
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