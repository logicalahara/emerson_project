import React from 'react';
import {Center, Alert, Text} from 'native-base';

const HomeScreen: React.FC = () => (
  <Center flex={1} background="#fff">
    <Alert status="success" px={10} py={5}>
      <Alert.Icon size="md" />
      <Text fontSize="md" fontWeight="medium">
        You're now logged in.
      </Text>
    </Alert>
  </Center>
);

export default HomeScreen;
