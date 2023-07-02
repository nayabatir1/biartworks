import React, { useMemo, useState } from 'react';
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
import { useSendOtp } from '@api/queries/auth.queries';

type FormProps = {
  email: string;
};

const schema: yup.ObjectSchema<FormProps> = yup.object({
  email: yup.string().email().required().trim(),
});

const ForgotPassword: React.FC<ScreenProps<'ForgotPassword'>> = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyle(theme), [theme]);

  const form = useForm<FormProps>({
    resolver: yupResolver(schema),
  });

  const sendOtp = useSendOtp();

  const handleSubmit = form.handleSubmit(data => {
    sendOtp.mutate(data, {
      onSuccess: () => {
        navigation.navigate('ResetPassword', {
          email: data.email,
        });
      },
    });
  });

  return (
    <FormProvider {...form}>
      <ScrollLayout containerStyle={styles.container}>
        <View style={styles.banner}>
          <Typography size={24} weight="bold" align="center" mb={12}>
            Forgot Password
          </Typography>

          <Typography color="accent" align="center">
            Enter your email to proceed further
          </Typography>
        </View>

        <ControlledEditText
          label="Email"
          placeholder="Enter your registered email"
          name="email"
          autoCapitalize="none"
          keyboardType="email-address"
          rightSection={<Icon name="email" size={18} />}
        />
        <Button onPress={handleSubmit} isLoading={sendOtp.isLoading} disabled={sendOtp.isLoading}>
          Send OTP
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

    success: {
      alignItems: 'center',
    },
  });

export default ForgotPassword;
