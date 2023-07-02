import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '@types';
import ControlledEditText, { ControlledEditTextProps } from './ControlledEditText';

export type PasswordInputProps = Omit<ControlledEditTextProps, 'secureTextEntry'> & {};

const PasswordInput = React.forwardRef<TextInput, PasswordInputProps>(({ ...props }, ref) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const [isVisible, setVisible] = React.useState(false);

  const toggle = React.useCallback(() => {
    setVisible(value => !value);
  }, []);

  return (
    <View style={styles.container}>
      <ControlledEditText
        ref={ref}
        {...props}
        secureTextEntry={!isVisible}
        containerStyle={styles.input}
        rightSection={
          <TouchableOpacity onPress={toggle} style={styles.button}>
            <Icon
              name={isVisible ? 'eye-off' : 'eye'}
              size={24}
              color={isVisible ? theme.colors.darkBorder : theme.colors.background}
            />
          </TouchableOpacity>
        }
      />
    </View>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {},
    input: {
      flex: 1,
    },
    button: {
      marginTop: 14,
      paddingHorizontal: theme.spacing.xs,
      marginHorizontal: theme.spacing.md,
    },
  });
