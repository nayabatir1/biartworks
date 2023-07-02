import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { ExtendedTheme } from '@types';
import { useFormContext } from 'react-hook-form';
import RadioButton from './RadioButton';

type TRadioButtonGroupProps = {
  options: Array<{ label: string; value: string }>;
  onPress?: (value: string) => void;
  name: string;
  style?: StyleProp<ViewStyle>;
};

const RadioButtonGroup: React.FC<TRadioButtonGroupProps> = ({ options, onPress, name, style }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const form = useFormContext();
  const lastSeen = form.watch(name);

  const handleToggleRadio = (val: string) => {
    form.setValue(name, val);
    onPress?.(val);
  };

  return (
    <View style={[styles.radioContainer, style]}>
      {options.map(item => (
        <TouchableOpacity
          key={item.value}
          style={styles.radioWrapper}
          onPress={() => handleToggleRadio(item.value)}
        >
          <RadioButton label={item.label} selected={lastSeen === item.value} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioButtonGroup;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    radioWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    radioContainer: { paddingHorizontal: theme.spacing.xxl },
  });
