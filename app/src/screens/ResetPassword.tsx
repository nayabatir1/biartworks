import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { ExtendedTheme } from '@types';
import Typography from '@components/shared/Typography';
import ControlledEditText from '@components/form/ControlledEditText';
import ScrollLayout from '@components/layout/ScrollLayout';
import Button from '@components/shared/Button';
import { ScreenProps } from '@utils/navigation';
import { useResetPassword } from '@api/queries/auth.queries';

type FormProps = {
  password: string;
  confirmPassword: string;
  otp: string;
};

const schema: yup.ObjectSchema<FormProps> = yup.object({
  otp: yup.string().trim().required('OTP is required'),
  password: yup.string().trim().required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Password must match'),
});

const ResetPassword: React.FC<ScreenProps<'ResetPassword'>> = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyle(theme), [theme]);

  const form = useForm<FormProps>({
    resolver: yupResolver(schema),
  });

  const resetPassword = useResetPassword();

  const handleSubmit = form.handleSubmit(data => {
    resetPassword.mutate(
      { ...data, otp: +data.otp },
      {
        onSuccess: () => {
          form.reset();
          Toast.show({
            text1: 'Password reset successful',
            type: 'success',
          });
          navigation.navigate('Login');
        },
      },
    );
  });

  return (
    <FormProvider {...form}>
      <ScrollLayout containerStyle={styles.container}>
        <View style={styles.banner}>
          <Typography size={24} weight="bold" align="center" mb={8}>
            Reset Password
          </Typography>

          <Typography color="accent" align="center">
            Enter password and confirm password
          </Typography>
        </View>

        <ControlledEditText
          label="OTP"
          name="otp"
          secureTextEntry
          rightSection={<Icon name="lock" size={18} />}
        />

        <ControlledEditText
          label="Password"
          name="password"
          secureTextEntry
          rightSection={<Icon name="lock" size={18} />}
        />

        <ControlledEditText
          label="Confirm Password"
          name="confirmPassword"
          secureTextEntry
          rightSection={<Icon name="lock" size={18} />}
        />

        <Button
          onPress={handleSubmit}
          isLoading={resetPassword.isLoading}
          disabled={resetPassword.isLoading}
        >
          Reset password
        </Button>

        <Typography
          color="primary"
          mt={25}
          align="center"
          onPress={() => navigation.navigate('Login')}
        >
          Sign in ?
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
      marginVertical: 150,
    },
    checkboxWrapper: {
      marginVertical: 20,
    },
  });

export default ResetPassword;
