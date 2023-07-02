import { StyleSheet, Text, TextInput, TextProps } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import fonts, { FontStyles } from '@utils/fonts';
import type { ExtendedTheme } from '@types';
import Animated from 'react-native-reanimated';

type Child = string | number | React.ReactElement | null | undefined;

export interface TypographyProps extends TextProps {
  children?: Child | Child[];
  weight?: keyof FontStyles;
  size?: number | keyof ExtendedTheme['fontSize'];
  align?: 'left' | 'center' | 'right' | 'auto' | 'justify';
  color?: keyof ExtendedTheme['colors'];
  mb?: number;
  mt?: number;
  ml?: number;
  mr?: number;
  animated?: boolean;
}

const Component = React.forwardRef<TextInput | Animated.Text, TypographyProps>(
  ({ animated, ...props }, ref) => {
    if (animated) return <Animated.Text ref={ref as React.LegacyRef<Animated.Text>} {...props} />;

    return <Text ref={ref as React.LegacyRef<Text>} {...props} />;
  },
);

const Typography = React.forwardRef<TextInput | Animated.Text, TypographyProps>(
  (
    { children, style, weight = 'regular', size = 'text', align, color, mb, mt, ml, mr, ...props },
    ref,
  ) => {
    const theme = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
      <Component
        ref={ref}
        {...props}
        style={[
          styles.text,
          { color: color ? theme.colors[color] : theme.colors.text },
          { fontSize: typeof size === 'number' ? size : theme.fontSize[size] },
          fonts[weight],
          align ? { textAlign: align } : null,
          mb ? { marginBottom: mb } : null,
          mt ? { marginTop: mt } : null,
          ml ? { marginLeft: ml } : null,
          mr ? { marginRight: mr } : null,
          style,
        ]}
      >
        {children}
      </Component>
    );
  },
);

export default Typography;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    text: {
      color: theme.colors.text,
    },
  });
