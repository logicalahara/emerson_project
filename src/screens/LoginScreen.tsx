import React, {useEffect, useState} from 'react';
import {View, useWindowDimensions, StyleSheet} from 'react-native';
import {
  Input,
  Stack,
  Text,
  Heading,
  Button,
  Image,
  ScrollView,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import DigitalTransformationImg from '../assets/startup.png';
import {indianMobRegex} from '../utils/globals';

// screen props
type LoginForm = {
  // user email or mobile
  userId: string;
  // user password
  password: string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 24,
  },
});

const LoginScreen: React.FC = () => {
  // accessing device's width and height
  const {width, height} = useWindowDimensions();
  // navigation hook
  const navigation = useNavigation();
  // switches email and mobile input state as per user input
  const [loginType, setLoginType] = useState<'email' | 'mobile'>('email');
  // toggles visibility of password input
  const [showPassword, setShowPassword] = useState(false);
  // form validation schema
  const validationSchema = yup.object({
    userId:
      loginType === 'email'
        ? yup
            .string()
            .email('Please enter valid email address')
            .required('Please enter an email address')
        : yup.string().matches(indianMobRegex, 'Please enter valid mobile'),
    password: yup.string().required('Please enter a password'),
  });
  // hook form instance
  const {control, handleSubmit, formState, reset} = useForm<LoginForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      reset();
    });
    // unmount
    return () => unsubscribe();
  }, [navigation, reset]);

  // function to handle form submission
  const onSubmit = () => {
    navigation.navigate('homeScreen');
    reset();
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Heading style={{textAlign: 'center'}}>Welcome</Heading>
        <Image
          source={DigitalTransformationImg}
          width={width}
          height={height * 0.55}
          alt="digital transformation"
        />
      </View>
      <Stack space={4} px={4} pb={10} style={{flex: 1}}>
        <Text style={{fontWeight: 'bold', fontSize: 20, paddingTop: 20}}>
          Login to get started
        </Text>
        <Controller
          control={control}
          render={({field: {onChange, value, onBlur}}) => (
            <Input
              onBlur={onBlur}
              value={value as string}
              onChangeText={text => {
                if (text.length === 0 || isNaN(Number(text))) {
                  setLoginType('email');
                } else {
                  setLoginType('mobile');
                }
                onChange(text);
              }}
              placeholder="Email or Mobile"
              InputLeftElement={
                loginType === 'mobile' ? (
                  <Text style={{paddingHorizontal: 10}}>+91</Text>
                ) : undefined
              }
            />
          )}
          name="userId"
        />
        {formState.errors.userId ? (
          <Text style={{color: 'red'}}>{formState.errors.userId.message}</Text>
        ) : null}
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              type={showPassword ? 'text' : 'password'}
              value={value as string}
              onBlur={onBlur}
              onChangeText={text => {
                onChange(text);
              }}
              placeholder="Password"
              InputRightElement={
                <Button
                  onPress={() => {
                    setShowPassword(!showPassword);
                  }}
                  variant="ghost">
                  <Text
                    style={{
                      fontWeight: showPassword ? '700' : '500',
                      fontSize: 12,
                    }}>
                    SHOW
                  </Text>
                </Button>
              }
            />
          )}
          name="password"
          rules={{required: 'Please enter password'}}
        />
        {formState.errors.password ? (
          <Text style={{color: 'red'}}>
            {formState.errors.password.message}
          </Text>
        ) : null}
        <Button
          style={{backgroundColor: '#4285F4'}}
          onPress={handleSubmit(onSubmit, formErr => {
            console.log('Form Error', formErr);
          })}>
          LOGIN
        </Button>
      </Stack>
    </ScrollView>
  );
};

export default LoginScreen;
