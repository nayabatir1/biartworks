import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import type { ExtendedTheme } from '../../types';

interface ScrollLayoutProps extends KeyboardAwareScrollViewProps {
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  scrollContainerStyle?: StyleProp<ViewStyle>;
  safeAreaStyle?: StyleProp<ViewStyle>;
}

const ScrollLayout = React.forwardRef<KeyboardAwareScrollView, ScrollLayoutProps>(
  ({ children, safeAreaStyle, containerStyle, ...props }, ref) => {
    const theme = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
      <SafeAreaView style={[styles.safeArea, safeAreaStyle]}>
        <KeyboardAwareScrollView
          {...props}
          ref={ref}
          style={[styles.scrollView, props.style]}
          contentContainerStyle={[styles.scrollViewContent, props.contentContainerStyle]}
        >
          <View style={[styles.view, containerStyle]}>{children}</View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  },
);

export default ScrollLayout;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    view: {
      flex: 1,
    },
    scrollView: {},
    scrollViewContent: {},
  });
