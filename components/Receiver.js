import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Linking } from 'react-native';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

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

export default function Receiver({ goBack }) {
  const [code, setCode] = useState('');
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const openInGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      Linking.openURL(url).catch((err) => console.error('Error opening Google Maps', err));
    }
  };

  useEffect(() => {
    let unsubscribe;
  
    if (code) {
      const docRef = doc(db, 'locations', code);
        
      unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setLocation(doc.data());
          setError(null); // Clear previous errors
        } else {
          setLocation(null);
          setError('No such document!');
        }
      }, (error) => {
        setError('Error fetching document: ' + error.message);
      });
    }

    // Cleanup subscription on component unmount or code change
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [code]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter unique code"
        value={code}
        onChangeText={setCode}
      />
      <Button title="Fetch Location" onPress={() => {}} disabled={!code} />
      {location && (
        <Button title="Open in Google Maps" onPress={openInGoogleMaps} />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    backgroundColor: '#f0f8ff',
  },
  input: {
    height: 40,
    borderColor: '#4682b4',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    width: '80%',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4682b4',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
