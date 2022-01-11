import {PermissionsAndroid} from 'react-native';

// helper method to handle location permission for scanning available bluetooth devices
export const handlePermissions = async () => {
  const grant = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Request for Location Permission',
      message: 'Bluetooth Scanner requires access to Fine Location Permission',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  return grant === PermissionsAndroid.RESULTS.GRANTED;
};

export default null;
