import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { ExtendedTheme } from '@types';
import Typography from '@components/shared/Typography';
import ControlledEditText from '@components/form/ControlledEditText';
import ScrollLayout from '@components/layout/ScrollLayout';
import Button from '@components/shared/Button';
import { ScreenProps } from '@utils/navigation';
import { useLogin } from '@api/queries/auth.queries';
import useUserStore from '@store/user.store';

type FormProps = {
  email: string;
  password: string;
};

const schema: yup.ObjectSchema<FormProps> = yup.object({
  email: yup.string().email().required().trim(),
  password: yup.string().required().trim(),
});

const LoginScreen: React.FC<ScreenProps<'Login'>> = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyle(theme), [theme]);

  const setUser = useUserStore(state => state.setUser);
  const login = useLogin();

  const form = useForm<FormProps>({
    resolver: yupResolver(schema),
  });

  const handleSubmit = form.handleSubmit(data => {
    login.mutate(data, {
      onSuccess: res => {
        console.log({ res });

        setUser(res);
      },
    });
  });

  return (
    <FormProvider {...form}>
      <ScrollLayout containerStyle={styles.container}>
        <View style={styles.banner}>
          <Typography size={24} weight="bold" align="center" mb={8}>
            Welcome to Flex N Gate 11
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
          rightSection={<Icon name="email" size={18} />}
        />

        <ControlledEditText
          label="Password"
          placeholder="Your password"
          name="password"
          secureTextEntry
          rightSection={<Icon name="lock" size={18} />}
        />

        <Button onPress={handleSubmit}>Sign in</Button>

        <Typography
          color="primary"
          mt={25}
          align="center"
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          Forgot password ?
        </Typography>

        <Typography
          color="primary"
          mt={35}
          align="center"
          onPress={() => navigation.navigate('Signup')}
        >
          Do not have a account ? Sign up here
        </Typography>
      </ScrollLayout>
    </FormProvider>
  );
};

const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
    },
    banner: {
      marginVertical: 130,
    },
    checkboxWrapper: {
      marginVertical: 20,
    },
  });

export default LoginScreen;
