import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PatientDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Patient Detail Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200EE',
  },
});

export default PatientDetailScreen;
