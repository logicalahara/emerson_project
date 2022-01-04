import React, {useState} from 'react';
import {View, useWindowDimensions} from 'react-native';
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
import {LoginForm} from '../utils/types';

const LoginScreen: React.FC = () => {
  //
  const {width, height} = useWindowDimensions();
  //
  const navigation = useNavigation();
  //
  const [loginType, setLoginType] = useState<'email' | 'mobile'>('email');
  //
  const [showPassword, setShowPassword] = useState(false);
  //
  const validationSchema = yup.object({
    userId:
      loginType === 'email'
        ? yup
            .string()
            .email('Please enter valid email address')
            .required('Please enter an email address')
        : yup.string().matches(/^[6-9]\d{9}$/, 'Please enter valid mobile'),
    password: yup.string().required('Please enter a password'),
  });
  //
  const {control, handleSubmit, formState} = useForm<LoginForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
    // shouldUnregister: false,
  });

  console.log('loginType', loginType);
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff', paddingVertical: 24}}>
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
                console.log('text', Number(text));
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
                  <Text style={{color: '#4285f4'}}>Show</Text>
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
          onPress={handleSubmit(
            formData => {
              console.log('formData', formData);
              navigation.navigate('homeScreen');
            },
            err => {
              console.log('formErr', err);
            },
          )}>
          LOGIN
        </Button>
      </Stack>
    </ScrollView>
  );
};

export default LoginScreen;
