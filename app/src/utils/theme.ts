import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '../types';
import fonts from './fonts';

const colors: ExtendedTheme['colors'] = {
  primary: '#6B59CC',
  background: '#FFF',
  lightBackground: '#F5F5F5',
  darkBorder: '#8C8C98',
  border: '#EEEEEE',
  card: '#FFFFFF',
  notification: '#6B59CC',
  text: '#000000',
  accent: '#8083A3',
  error: '#FF0000',
  success: '#00C853',
  transparent: 'transparent',
  white: '#FFFFFF',
  dark: '#000000',
  blue: '#0D1A40',
};

const spacing: ExtendedTheme['spacing'] = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

const fontSize: ExtendedTheme['fontSize'] = {
  xs: 12,
  text: 16,
  small: 14,
  medium: 16,
  large: 20,
  h1: 24,
};

const rounded: ExtendedTheme['rounded'] = {
  sm: 8,
  md: 16,
  lg: 24,
  card: 35,
};

export const AppTheme: ExtendedTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
  fonts,
  spacing,
  fontSize,
  rounded,
};

export const AppDarkTheme: ExtendedTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...colors,
  },
  fonts,
  spacing,
  fontSize,
  rounded,
};

export function boxShadow(
  color: string,
  offset = { height: 2, width: 2 },
  radius = 4,
  opacity = 0.2,
) {
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius,
  };
}
