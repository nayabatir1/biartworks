import React from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import EditSelect, { EditSelectProps } from './EditSelect';

interface ControlledEditSelectProps extends EditSelectProps {
  name: string;
  defaultValue?: string;
}

const ControlledEditSelect: React.FC<ControlledEditSelectProps> = ({
  name,
  defaultValue,
  ...props
}) => {
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
    <EditSelect
      {...props}
      value={value}
      onChange={controller.field.onChange}
      error={controller.fieldState.error?.message}
    />
  );
};

export default ControlledEditSelect;
