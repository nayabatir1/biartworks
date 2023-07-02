import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, GestureResponderEvent } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import AIcon from 'react-native-vector-icons/AntDesign';

import { ExtendedTheme } from '@types';
import Typography from '@components/shared/Typography';
import ControlledEditText from '@components/form/ControlledEditText';
import ScrollLayout from '@components/layout/ScrollLayout';
import CheckboxWithLabel from '@components/form/CheckboxWithLabel';
import Button from '@components/shared/Button';
import { ScreenProps } from '@utils/navigation';
import { useSignup } from '@api/queries/auth.queries';
import Storage from '@utils/storage';

type FormProps = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
};

const schema: yup.ObjectSchema<FormProps> = yup.object({
  email: yup.string().email().required(),
  name: yup.string().required().trim(),
  password: yup.string().required().trim(),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Password must match'),
});

const SignupScreen: React.FC<ScreenProps<'Signup'>> = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyle(theme), [theme]);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const signup = useSignup();

  const form = useForm<FormProps>({
    resolver: yupResolver(schema),
  });

  const name = form.watch('name');
  const pass = form.watch('password');
  const cPass = form.watch('confirmPassword');

  const goToPrivacyPolicy = useCallback((e: GestureResponderEvent) => {
    e.stopPropagation();
    navigation.navigate('PrivacyPolicy');
  }, []);

  const handleSubmit = form.handleSubmit(data => {
    signup.mutate(data, {
      onSuccess: async res => {
        navigation.navigate('ThankYou', { user: res });
      },
    });
  });

  return (
    <FormProvider {...form}>
      <ScrollLayout containerStyle={styles.container}>
        <Button
          backgroundColor="lightBackground"
          textColor="accent"
          borderless
          style={styles.cancel}
        >
          Cancel
        </Button>
        <View style={styles.banner}>
          <Typography size={32} weight="bold" align="center" mb={8}>
            Enter Position & Dept
          </Typography>

          <Typography color="accent" align="center">
            Enter your details to proceed further
          </Typography>
        </View>

        <ControlledEditText
          label="Email"
          placeholder="Your Email"
          name="email"
          autoCapitalize="none"
          keyboardType="email-address"
          rightSection={<MIcon name="email" size={18} />}
        />

        <ControlledEditText
          label="First and Last name"
          placeholder="Enter your name"
          name="name"
          rightSection={
            <FIcon
              name="user-alt"
              size={18}
              color={name ? theme.colors.dark : theme.colors.accent}
            />
          }
        />

        <ControlledEditText
          label="Password"
          placeholder="Enter your password"
          name="password"
          secureTextEntry
          rightSection={
            <FIcon name="lock" size={18} color={pass ? theme.colors.dark : theme.colors.accent} />
          }
        />

        <ControlledEditText
          label="Confirm Password"
          placeholder="Confirm your password"
          name="confirmPassword"
          secureTextEntry
          rightSection={
            <AIcon
              name="checkcircle"
              size={18}
              color={pass && cPass && pass === cPass ? theme.colors.dark : theme.colors.accent}
            />
          }
        />

        <CheckboxWithLabel
          value={termsAgreed}
          onChange={() => setTermsAgreed(p => !p)}
          label={
            <Typography color="accent" ml={5} onPress={goToPrivacyPolicy}>
              I agree with terms & Conditions
            </Typography>
          }
          style={styles.checkboxWrapper}
        />

        <Button disabled={!termsAgreed} onPress={handleSubmit}>
          Continue
        </Button>
      </ScrollLayout>
    </FormProvider>
  );
};

const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
    },
    banner: {
      marginVertical: 50,
    },
    checkboxWrapper: {
      marginVertical: 20,
    },
    cancel: {
      width: 100,
      paddingVertical: theme.spacing.sm,
      marginLeft: 'auto',
      marginTop: 20,
    },
  });

export default SignupScreen;
