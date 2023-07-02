import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '@types';

interface DividerProps {
  style?: StyleProp<ViewStyle>;
}

const Divider: React.FC<DividerProps> = ({ style }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return <View style={[styles.divider, style]} />;
};

export default Divider;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.text,
      marginVertical: theme.spacing.sm,
    },
  });
