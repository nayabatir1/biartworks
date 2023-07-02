import * as React from 'react';
import {
  TouchableOpacityProps,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlexAlignType,
  StyleProp,
  TextStyle,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { ExtendedTheme, FontSize } from '../../types';
import Typography, { TypographyProps } from './Typography';

interface ButtonProps extends TouchableOpacityProps {
  children?: string | React.ReactElement;
  isLoading?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fontSize?: keyof FontSize | number;
  backgroundColor?: keyof ExtendedTheme['colors'] | string;
  textColor?: keyof ExtendedTheme['colors'];
  mb?: number;
  mt?: number;
  align?: FlexAlignType;
  borderless?: boolean;
  borderColor?: keyof ExtendedTheme['colors'] | string;
  textStyle?: StyleProp<TextStyle>;
  textProps?: TypographyProps;
}

const Button: React.FC<ButtonProps> = ({
  children,
  style,
  isLoading = false,
  fontSize = 'medium',
  backgroundColor,
  textColor,
  icon,
  rightIcon,
  mb,
  mt,
  align,
  borderless = false,
  borderColor,
  textStyle,
  textProps,
  ...props
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const bgColor = React.useMemo(() => {
    if (!backgroundColor) return undefined;

    if (Object.keys(theme.colors).includes(backgroundColor))
      return theme.colors[backgroundColor as keyof ExtendedTheme['colors']];

    return backgroundColor;
  }, [backgroundColor, theme.colors]);

  const intrinsicBorderColor = React.useMemo(() => {
    if (!borderColor) return undefined;

    if (Object.keys(theme.colors).includes(borderColor))
      return theme.colors[borderColor as keyof ExtendedTheme['colors']];

    return borderColor;
  }, [borderColor, theme.colors]);

  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.container,
        { backgroundColor: backgroundColor ? bgColor : theme.colors.primary },
        mb ? { marginBottom: mb } : null,
        mt ? { marginTop: mt } : null,
        align ? { alignSelf: align } : null,
        borderless ? styles.borderless : styles.border,
        borderColor ? { borderColor: intrinsicBorderColor } : null,
        props.disabled ? styles.disabled : null,
        style,
      ]}
      activeOpacity={0.8}
    >
      {icon}
      <Typography
        style={[
          styles.text,
          { color: textColor ? theme.colors[textColor] : theme.colors.white },
          icon ? { marginLeft: theme.spacing.lg } : null,
          textStyle,
        ]}
        size={fontSize}
        weight="bold"
        align="center"
        {...textProps}
      >
        {children}
      </Typography>
      {rightIcon}
      {isLoading ? (
        <ActivityIndicator color={theme.colors.text} size={16} style={styles.loader} />
      ) : null}
    </TouchableOpacity>
  );
};

export default Button;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.rounded.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    border: {
      borderWidth: 2,
    },
    borderless: {
      borderWidth: 0,
    },
    textContainer: {
      flexGrow: 1,
    },
    text: {
      color: theme.colors.background,
    },
    loader: {
      marginLeft: theme.spacing.sm,
    },
    disabled: {
      opacity: 0.8,
    },
  });
