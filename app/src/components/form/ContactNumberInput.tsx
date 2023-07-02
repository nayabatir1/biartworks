import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '@types';
import ControlledEditText from './ControlledEditText';
import { EditTextProps } from './EditText';

const BORDER_COLOR = '#BDBDBD';

interface ContactNumberFieldProps extends Omit<EditTextProps, 'name'> {
  name: string;
  onNext?: () => void;
}

const ContactNumberField: React.FC<ContactNumberFieldProps> = ({ name, onNext, ...props }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme, false), [theme]);

  return (
    <View style={styles.container}>
      <ControlledEditText
        {...props}
        keyboardType="phone-pad"
        name={name}
        containerStyle={styles.number}
        onNext={onNext}
      />
    </View>
  );
};

export default ContactNumberField;

const createStyles = (theme: ExtendedTheme, isError?: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%',
    },
    countryCode: {
      ...theme.fonts.regular,
      color: theme.colors.text,
      backgroundColor: isError ? theme.colors.error : theme.colors.lightBackground,
      borderWidth: 2,
      paddingHorizontal: 12,
      borderColor: BORDER_COLOR,
      fontSize: theme.fontSize.medium,
      marginTop: 16,
      marginRight: 8,
    },
    number: {
      flex: 1,
    },
  });
