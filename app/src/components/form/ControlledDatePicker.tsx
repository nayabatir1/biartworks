import { StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { DatePickerProps } from 'react-native-date-picker';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import DatePicker from './DatePicker';

interface ControlledDatePickerProps extends Omit<DatePickerProps, 'date'> {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  name: string;
}

const ControlledDatePicker: React.FC<ControlledDatePickerProps> = ({ name, label, ...props }) => {
  const form = useFormContext();
  const controller = useController({
    control: form.control,
    name,
    defaultValue: form.getValues(name) ?? undefined,
  });

  const value = useWatch({
    control: form.control,
    name,
    defaultValue: form.getValues(name) ?? undefined,
  });

  return (
    <DatePicker
      {...props}
      label={label}
      value={value ?? controller.field.value}
      onChange={controller.field.onChange}
      error={controller.fieldState.error?.message}
    />
  );
};

export default ControlledDatePicker;
