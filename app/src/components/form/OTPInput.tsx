import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '@types';
import { isEmpty } from 'lodash';
import Typography from '@components/shared/Typography';

const BORDER_COLOR = '#BDBDBD';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  error?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, style, error }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const [otp, setOtp] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (/^[0-9]{6}$/.test(value)) {
      setOtp(value.split(''));
    }
  }, [value]);

  const refs = [0, 1, 2, 3, 4, 5].reduce((acc: Record<number, React.RefObject<TextInput>>, v) => {
    acc[v] = React.createRef<TextInput>();

    return acc;
  }, {});

  const handleFocusNext = (i: number, text: string) => {
    if (i < 5 && !isEmpty(text)) {
      refs[i + 1].current?.focus();
    }

    if (i === 5) {
      refs[i].current?.blur();
    }

    const otpValue = [...otp];

    otpValue[i] = text;
    setOtp(otpValue);
    onChange(otpValue.join(''));
  };

  const handleFocusPrevious = (key: string, i: number) => {
    if (key === 'Backspace' && i !== 0) {
      refs[i - 1].current?.focus();
    }
  };

  return (
    <View style={style}>
      <View style={styles.container}>
        {[0, 1, 2, 3, 4, 5].map((i, _) => (
          <TextInput
            key={i}
            keyboardType="numeric"
            style={styles.input}
            ref={refs[i]}
            value={otp?.[i] ?? ''}
            maxLength={1}
            onChangeText={text => handleFocusNext(i, text)}
            onKeyPress={e => handleFocusPrevious(e.nativeEvent.key, i)}
            textAlign="center"
          />
        ))}
      </View>
      {error ? (
        <Typography color="error" size="small">
          {error}
        </Typography>
      ) : null}
    </View>
  );
};

export default OTPInput;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    input: {
      borderBottomWidth: 2,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.lightBackground,
      borderWidth: 2,
      borderColor: BORDER_COLOR,
      color: theme.colors.primary,
      ...theme.fonts.bold,
      fontSize: 16,
    },
  });
