import React from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import Select, { SelectProps } from './Select';

interface ControlledSelectProps extends SelectProps {
  name: string;
  defaultValue?: string;
}

const ControlledSelect: React.FC<ControlledSelectProps> = ({ name, defaultValue, ...props }) => {
  const form = useFormContext();

  const controller = useController({
    control: form.control,
    name,
    defaultValue: form.getValues(name) ?? defaultValue ?? '',
  });

  const value = useWatch({
    control: form.control,
    name,
    defaultValue: form.getValues(name) ?? defaultValue ?? '',
  });

  return (
    <Select
      {...props}
      value={value}
      onChange={controller.field.onChange}
      error={controller.fieldState.error?.message}
    />
  );
};

export default ControlledSelect;
