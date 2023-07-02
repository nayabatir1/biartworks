import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { createNavigationContainerRef } from '@react-navigation/native';
import { IUser } from '@entities/entities';

export type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  PrivacyPolicy: undefined;
  ThankYou: { user: IUser };
  Dashboard: undefined;
  AddIssue: undefined;
  Issue: { id: string };
  ForgotPassword: undefined;
  ResetPassword: { email: string };
  Search: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
