import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { ExtendedTheme } from '@types';
import Typography from '@components/shared/Typography';
import Button from '@components/shared/Button';
import { ScreenProps } from '@utils/navigation';

import ThankYouImg from '../assets/png/thankYou.png';
import BaseLayout from '@components/layout/BaseLayout';
import useUserStore from '@store/user.store';

const ThankYouScreen: React.FC<ScreenProps<'ThankYou'>> = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyle(theme), [theme]);
  const setUser = useUserStore(state => state.setUser);

  const goToDashboard = useCallback(() => {
    setUser(route.params.user);
    setTimeout(() => {
      navigation.navigate('Dashboard');
    }, 500);
  }, [route.params.user, setUser]);

  return (
    <BaseLayout style={styles.container}>
      <Button
        backgroundColor="lightBackground"
        textColor="accent"
        borderless
        style={styles.done}
        onPress={() => navigation.navigate('Dashboard')}
      >
        Done
      </Button>

      <View style={styles.banner}>
        <Image source={ThankYouImg} />
        <Typography size={32} weight="bold" align="center" mb={8} mt={10}>
          Thank you
        </Typography>

        <Typography color="accent" align="center">
          We sent confirmation email to {'\n'} {route.params?.user?.email || ''}
        </Typography>
      </View>

      <Button onPress={goToDashboard}>Go to Dashboard</Button>
    </BaseLayout>
  );
};

const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      justifyContent: 'space-between',
    },
    banner: {
      marginVertical: 80,
      alignItems: 'center',
    },
    checkboxWrapper: {
      marginVertical: 20,
    },
    done: {
      width: 100,
      paddingVertical: theme.spacing.sm,
      marginLeft: 'auto',
      marginTop: 20,
    },
  });

export default ThankYouScreen;
