import React, { useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import Sender from './components/Sender';
import Receiver from './components/Receiver';

export default function App() {
  const [screen, setScreen] = useState(null);

  const goBack = () => setScreen(null);

  return (
    <View style={styles.container}>
      {screen === null && (
        <>
          <Button title="Sender" onPress={() => setScreen('sender')} />
          <Button title="Receiver" onPress={() => setScreen('receiver')} />
        </>
      )}
      {screen === 'sender' && <Sender goBack={goBack} />}
      {screen === 'receiver' && <Receiver goBack={goBack} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
