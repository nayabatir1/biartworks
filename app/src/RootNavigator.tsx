import React, { useEffect } from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFlipper } from '@react-navigation/devtools';
import { PermissionsAndroid, StatusBar, useColorScheme } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

import { AppDarkTheme, AppTheme } from './utils/theme';
import { navigationRef, RootStackParamList } from './utils/navigation';
import AppBar from './components/AppBar';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import PrivacyPolicy from './screens/PrivacyPolicyScreen';
import ThankYouScreen from './screens/ThankYouScreen';
import DashboardScreen from './screens/DashboardScreen';
import AddIssueScreen from './screens/AddIssueScreen';
import IssueScreen from './screens/IssueScreen';
import Toast from 'react-native-toast-message';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import useUserStore from '@store/user.store';
import SearchScreen from './screens/SearchScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['bitart://'],
  config: {
    screens: {
      // screen: 'deeplink/url',
    },
  },
};

const requestPermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      granted['android.permission.CAMERA'] &&
      granted['android.permission.WRITE_EXTERNAL_STORAGE'] &&
      granted['android.permission.READ_EXTERNAL_STORAGE'] &&
      granted['android.permission.RECORD_AUDIO']
    ) {
      // console.log('You can use the camera');
    } else {
      Toast.show({
        text1: 'Camera permission denied',
        type: 'warning',
      });
    }
  } catch (_error) {
    Toast.show({
      text1: 'Camera permission denied',
      type: 'warning',
    });
  }
};

const RootNavigator = () => {
  const scheme = useColorScheme();

  const user = useUserStore(state => state.user);

  useFlipper(navigationRef);

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <NavigationContainer
      onReady={RNBootSplash.hide}
      theme={scheme === 'dark' ? AppDarkTheme : AppTheme}
      ref={navigationRef}
      linking={linking}
    >
      <StatusBar backgroundColor="#0A2F7B" />
      <RootStack.Navigator
        initialRouteName="Login"
        screenOptions={{ animation: 'slide_from_right', header: AppBar }}
      >
        {!user ? (
          <>
            <RootStack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <RootStack.Screen name="Dashboard" component={DashboardScreen} />
            <RootStack.Screen name="AddIssue" component={AddIssueScreen} />
            <RootStack.Screen name="Issue" component={IssueScreen} />
            <RootStack.Screen name="Search" component={SearchScreen} />
          </>
        )}

        <RootStack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ headerShown: false }}
        />

        <RootStack.Screen
          name="ThankYou"
          component={ThankYouScreen}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
