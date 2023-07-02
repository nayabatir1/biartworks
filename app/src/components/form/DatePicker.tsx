import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import RNDatePicker, { DatePickerProps as RNDatePickerProps } from 'react-native-date-picker';
import dayjs from 'dayjs';
import type { ExtendedTheme } from '../../types';
import EditText from './EditText';

interface DatePickerProps extends Omit<RNDatePickerProps, 'date'> {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
  value?: Date | null;
  onChange?: (value?: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label = 'Date',
  containerStyle,
  error,
  value,
  onChange,
  ...props
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const [date, setDate] = React.useState<Date | undefined | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <EditText
          placeholder={label}
          editable={false}
          value={date ? dayjs(date).format('D MMMM, YYYY') : undefined}
          error={error}
        />
      </TouchableOpacity>

      <RNDatePicker
        {...props}
        mode="date"
        date={date ?? dayjs().subtract(18, 'year').toDate()}
        modal
        open={open}
        onConfirm={selectedDate => {
          setOpen(false);
          setDate(selectedDate);
          if (onChange) onChange(selectedDate);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

export default DatePicker;

const createStyles = (_theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {},
  });
