import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '@types';
import CheckBox from '@react-native-community/checkbox';
import Typography from '@components/shared/Typography';

export interface CheckboxWithLabelProps {
  value: boolean;
  onChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  label?: string | React.ReactNode;
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({
  value,
  onChange,
  style,
  label,
  iconStyle,
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity onPress={() => onChange(!value)} style={[styles.checkbox, style]}>
      <CheckBox
        disabled
        value={value}
        tintColors={{ true: theme.colors.primary, false: theme.colors.primary }}
        tintColor={theme.colors.border}
        style={iconStyle}
        lineWidth={1}
        onAnimationType="flat"
        offAnimationType="flat"
      />
      {label ? (
        typeof label === 'string' ? (
          <Typography color="accent" style={styles.optionText} size="small">
            {label}
          </Typography>
        ) : (
          label
        )
      ) : null}
    </TouchableOpacity>
  );
};

export default CheckboxWithLabel;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    checkbox: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionText: { flex: 1, marginLeft: theme.spacing.sm },
  });
