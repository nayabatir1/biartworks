import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '@types';
import Animated, {
  Easing,
  useAnimatedStyle,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Typography from '@components/shared/Typography';

export interface EditTextProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
  rightSection?: React.ReactNode;
  label?: string;
}

const EditText = React.forwardRef<TextInput, EditTextProps>(
  ({ containerStyle, error, numberOfLines, rightSection, label, ...props }, ref) => {
    const theme = useTheme();
    const styles = React.useMemo(
      () => createStyles(theme, numberOfLines !== undefined),
      [theme, numberOfLines],
    );

    const errorTextStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: error
            ? withDelay(
                200,
                withSequence(
                  withTiming(10, {
                    duration: 200,
                    easing: Easing.bounce,
                  }),
                  withTiming(0, {
                    duration: 200,
                    easing: Easing.bounce,
                  }),
                ),
              )
            : 0,
        },
      ],
    }));

    return (
      <View style={styles.container}>
        {label ? (
          <Typography color="accent" style={styles.label}>
            {label}
          </Typography>
        ) : null}
        <View style={[styles.inputContainer, containerStyle]}>
          <TextInput
            {...props}
            style={[styles.input, props.style]}
            ref={ref}
            numberOfLines={numberOfLines}
            placeholderTextColor={theme.colors.darkBorder}
          />
          {rightSection}
        </View>
        {error ? (
          <Animated.Text style={[styles.errorText, errorTextStyle]}>{error}</Animated.Text>
        ) : null}
      </View>
    );
  },
);

EditText.displayName = 'Edit Text';

export default EditText;

const createStyles = (theme: ExtendedTheme, isMultiline: boolean = false) =>
  StyleSheet.create({
    container: {
      marginVertical: theme.spacing.md,
    },
    inputContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    label: {
      paddingHorizontal: theme.spacing.md,
    },
    errorText: {
      color: theme.colors.error,
      ...theme.fonts.regular,
      fontSize: 12,
    },
    input: {
      flex: 1,
      ...theme.fonts.bold,
      color: theme.colors.text,
      fontSize: theme.fontSize.medium,
      padding: theme.spacing.md,
      textAlignVertical: isMultiline ? 'top' : 'center',
    },
  });
