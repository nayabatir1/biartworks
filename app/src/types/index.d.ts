import type { Theme } from '@react-navigation/native';
import type { FontStyles } from '../theme/fonts';

interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

interface FontSize {
  xs: number;
  text: number;
  small: number;
  h1: number;
  medium: number;
  large: number;
}

interface BorderRadii {
  sm: number;
  md: number;
  lg: number;
  card: number;
}

interface ExtendedTheme extends Theme {
  colors: Theme['colors'] & {
    accent: string;
    error: string;
    transparent: string;
    white: string;
    dark: string;
    lightBackground: string;
    darkBorder: string;
    success: string;
    blue: string;
  };
  spacing: Spacing;
  fonts: FontStyles;
  fontSize: FontSize;
  rounded: BorderRadii;
}

declare module '@react-navigation/native' {
  export function useTheme(): ExtendedTheme;
}
