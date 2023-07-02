import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import type { ExtendedTheme } from '../../types';

interface BaseLayoutProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  safeAreaProps?: SafeAreaViewProps;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ style, children, safeAreaProps }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView {...safeAreaProps} style={[styles.safeArea, safeAreaProps?.style]}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
};

export default BaseLayout;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
    },
  });
