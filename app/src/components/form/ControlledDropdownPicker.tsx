import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import DropdownPicker, { DropdownPickerProps } from './DropdownPicker';

interface ControlledDropdownPickerProps extends Omit<DropdownPickerProps, 'value' | 'onChange'> {
  name: string;
}

const ControlledDropdownPicker: React.FC<ControlledDropdownPickerProps> = ({ name, ...props }) => {
  const form = useFormContext();
  const { field, fieldState } = useController({
    name,
    control: form.control,
  });

  return (
    <DropdownPicker
      {...props}
      value={field.value}
      onChange={field.onChange}
      error={fieldState.error?.message}
    />
  );
};

export default ControlledDropdownPicker;
