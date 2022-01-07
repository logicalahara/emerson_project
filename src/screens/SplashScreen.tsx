import React from 'react';
import {ActivityIndicator, StyleSheet, View, Text} from 'react-native';

interface Props {
  // render label below spinner
  loadingLabel?: string;
}

/* Styles used in this functional component */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  activityIndicator: {marginBottom: 30, color: '#000'},
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#000',
  },
});

/* React functional component */
const SplashScreen = ({loadingLabel}: Props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color="black"
        style={styles.activityIndicator}
      />
      {loadingLabel ? <Text style={styles.title}>{loadingLabel}</Text> : null}
    </View>
  );
};

export default SplashScreen;
