import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Linking } from 'react-native';
import * as Location from 'expo-location';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import uuid from 'react-native-uuid';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANAnGjKIe2MEQnLl1ELEPXndJoedfTzXo", 
  authDomain: "novatracking-ac276.firebaseapp.com",
  databaseURL: "https://novatracking-ac276-default-rtdb.firebaseio.com",
  projectId: "novatracking-ac276",
  storageBucket: "novatracking-ac276.appspot.com",
  messagingSenderId: "307460477155",
  appId: "1:307460477155:web:556cc00292f85008b0b5d6",
  measurementId: "G-9MBEE6ER5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Sender({ goBack }) {
  const [uniqueCode, setUniqueCode] = useState(uuid.v4()); // Generate UUID using react-native-uuid
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('Error fetching location');
      }
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    const updateLocationInFirestore = async () => {
      if (location) {
        try {
          const docRef = doc(db, 'locations', uniqueCode);
          await setDoc(docRef, {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: new Date(),
          });
        } catch (error) {
          console.error("Error writing document: ", error);
        }
      }
    };

    updateLocationInFirestore();
  }, [location]);

  const openInGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
      Linking.openURL(url).catch((err) => console.error('Error opening Google Maps', err));
    }
  };

  return (
    <View style={styles.container}>
      <Text>Your unique code: {uniqueCode}</Text>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : ( 
        <>
          <Button title="Refresh Location" onPress={async () => {
            try {
              let location = await Location.getCurrentPositionAsync({});
              setLocation(location);
            } catch (error) {
              setErrorMsg('Error refreshing location');
              console.error("Error refreshing location: ", error);
            }
          }} />
          {location && (
            <Button title="Open in Google Maps" onPress={openInGoogleMaps} />
          )}
        </>
      )}
      <Button title="Back" onPress={goBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
  },
});
