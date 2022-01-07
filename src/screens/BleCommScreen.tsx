import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {bleManager} from '../utils/helpers';
// import {} from 'react-native-ble-plx';

const BleCommScreen = () => {
  // export const bleManager = new BleManager();

  const scanAndConnect = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device) {
        if (
          device.name === 'TI BLE Sensor Tag' ||
          device.name === 'SensorTag'
        ) {
          // Stop scanning as it's not necessary if you are scanning for one device.
          bleManager.stopDeviceScan();

          // Proceed with connection.
        }
      }
    });
  };

  // componentDidMount
  useEffect(() => {
    const subscription = bleManager.onStateChange(state => {
      if (state === 'PoweredOn') {
        scanAndConnect();
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
  });

  return (
    <View>
      <Text>sas</Text>
    </View>
  );
};

export default BleCommScreen;
