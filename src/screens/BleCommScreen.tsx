import React, {ReactNode, useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  LogBox,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  FlatList,
  Switch,
  Text,
  Center,
  Button,
  Actionsheet,
  CheckIcon,
  Box,
  VStack,
  Divider,
  HStack,
  Heading,
} from 'native-base';
import {Appbar, Card} from 'react-native-paper';
import {BleManager} from 'react-native-ble-plx';
import {handlePermissions} from '../utils/helpers';
import {COLORS} from '../utils/globals';
// ignoring warnings
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

// initialising bluetooth manager instance
const manager = new BleManager();

const BleCommScreen = () => {
  // accessing navigation hook
  const navigation = useNavigation();
  // maintaining scanned device(s) data
  const [scannedDevices, setScannedDevices] = useState<
    Record<string, number | string | null>
  >({});
  // state to toggle bluetooth
  const [bluetoothToggle, setBluetoothToggle] = useState<boolean>(false);
  //
  const [deviceSearchLoading, setDeviceSearchLoading] =
    useState<boolean>(false);
  // controls selected ble device which is connected
  const [connectedDeviceId, setConnectedDeviceId] = useState<string | null>(
    null,
  );
  // toggles visibility state of action sheet
  const [showSheet, setShowSheet] = useState<boolean>(false);

  useEffect(() => {
    // remounting component when tab is switched again
    const unsubscribe = navigation.addListener('focus', () => {
      // checking for current ble state and updating initial value of state
      manager
        .state()
        .then(status => {
          setBluetoothToggle(status !== 'PoweredOff');
        })
        .catch(bleStateErr => console.log('bleStateErr', bleStateErr));
      manager.onStateChange(() => {
        const subscription = manager.onStateChange(async () => {
          subscription.remove();
        }, true);
        return () => {
          subscription.remove();
          manager.destroy();
        };
      });
    });
    // unmount
    return () => unsubscribe();
  }, [navigation]);

  // scanning for nearby peripherals
  const onDeviceScan = async () => {
    try {
      // ble state instance
      const bleState = await manager.state();
      // test if bluetooth is powered on
      if (bleState !== 'PoweredOn') {
        Alert.alert('Bluetooth Disabled', 'Please Turn on Bluetooth');
        return false;
      }
      // asks for location permission
      const permission = await handlePermissions();
      // if permission is granted
      if (permission) {
        setDeviceSearchLoading(true);
        manager.startDeviceScan([], null, async (error, device) => {
          // error handling
          if (error) {
            Alert.alert(error.message);
          }
          // found a bluetooth device
          if (device) {
            const newScannedDevices = scannedDevices;
            newScannedDevices[device.id] = device;
            setScannedDevices(scannedDevices);
          }
        });
      }
    } catch (err) {
      console.log('Error', err);
    }
  };

  // storing count of scanned devices
  const devicesCount = Object.keys(scannedDevices).length;
  // storing connected device data to render on sheet
  const pairedDeviceData = connectedDeviceId
    ? scannedDevices[connectedDeviceId]
    : null;

  // handling render state on ble device search
  const handleBleRenderState = (): ReactNode | null => {
    if (devicesCount >= 1 && bluetoothToggle) {
      return (
        <FlatList
          keyExtractor={({id}) => id}
          data={Object.values(scannedDevices)}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    // whether selected ble device is connected
                    const isDeviceConnected = await manager.isDeviceConnected(
                      item.id,
                    );
                    setConnectedDeviceId(item.id);
                    setShowSheet(true);
                    if (!isDeviceConnected) {
                      await manager.connectToDevice(item.id);
                    }
                  } catch (err) {
                    console.log('Connection Error', err);
                  }
                }}>
                <Card
                  elevation={3}
                  key={item.id}
                  style={{
                    backgroundColor: COLORS.grey,
                    marginHorizontal: 15,
                    marginVertical: 8,
                  }}>
                  <Card.Title
                    title={!item.name ? item.id : item.name}
                    right={(...props) =>
                      item.id === connectedDeviceId ? (
                        <CheckIcon size="xs" {...props} pr={16} />
                      ) : undefined
                    }
                  />
                </Card>
              </TouchableOpacity>
            );
          }}
        />
      );
    }
    return null;
  };

  return (
    <>
      {connectedDeviceId ? (
        <Actionsheet
          isOpen={showSheet}
          onClose={() => {
            manager
              .cancelDeviceConnection(connectedDeviceId)
              .then(() => {
                setShowSheet(false);
              })
              .catch(err => {
                console.log('Cancel device connection error', err);
                setShowSheet(false);
              });
          }}>
          <Actionsheet.Content>
            <Box w="100%" h={400} px={4}>
              <VStack>
                <Center my={5}>
                  <Heading>Device Specs</Heading>
                </Center>
                {pairedDeviceData ? (
                  <>
                    <HStack justifyContent="space-between">
                      <Text style={{fontWeight: '700'}}>Device ID</Text>
                      <Text>{pairedDeviceData.id}</Text>
                    </HStack>
                    <Divider mt={2} />
                    {pairedDeviceData.name ? (
                      <HStack justifyContent="space-between">
                        <Text style={{fontWeight: '700'}}>Device Name</Text>
                        <Text>{pairedDeviceData.name}</Text>
                      </HStack>
                    ) : null}
                    <Divider mt={2} />
                    <HStack justifyContent="space-between">
                      <Text style={{fontWeight: '700'}}>Manufacturer</Text>
                      <Text>{pairedDeviceData.manufacturerData}</Text>
                    </HStack>
                    <Divider mt={2} />
                    <HStack justifyContent="space-between">
                      <Text style={{fontWeight: '700'}}>MTU</Text>
                      <Text>{pairedDeviceData.mtu}</Text>
                    </HStack>
                    <Divider mt={2} />
                    <HStack justifyContent="space-between">
                      <Text style={{fontWeight: '700'}}>RSSI</Text>
                      <Text>{pairedDeviceData.rssi}</Text>
                    </HStack>
                  </>
                ) : (
                  <Center>
                    <Text>Device data not available</Text>
                  </Center>
                )}
              </VStack>
            </Box>
          </Actionsheet.Content>
        </Actionsheet>
      ) : null}
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
          <Appbar.Content title="Bluetooth" titleStyle={{color: 'black'}} />
          {deviceSearchLoading ? <ActivityIndicator color="grey" /> : null}
          <Switch
            isChecked={bluetoothToggle}
            onToggle={async () => {
              setBluetoothToggle(prevState => {
                if (!prevState) {
                  setScannedDevices({});
                }
                return !prevState;
              });

              const btState = await manager.state();
              try {
                // test is bluetooth is supported
                if (btState === 'Unsupported') {
                  Alert.alert('Bluetooth not supported', 'Please try again !');
                }
                // enable if it is not powered on
                if (btState !== 'PoweredOn') {
                  await manager.enable();
                } else {
                  await manager.disable();
                  setDeviceSearchLoading(false);
                }
              } catch (err) {
                console.log('Error', err);
                setDeviceSearchLoading(false);
              }
            }}
            style={{marginRight: 10}}
            colorScheme="blue"
          />
        </Appbar.Header>
        <View style={{flex: 1}}>{handleBleRenderState()}</View>
        {!deviceSearchLoading ? (
          <Button
            colorScheme="blue"
            size="md"
            borderRadius={0}
            py={3}
            onPress={async () => {
              await onDeviceScan();
            }}>
            Scan for Devices
          </Button>
        ) : null}
      </View>
    </>
  );
};

export default BleCommScreen;
