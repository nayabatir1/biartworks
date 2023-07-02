import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import CheckboxWithLabel, { CheckboxWithLabelProps } from './CheckboxWithLabel';

interface ControlledCheckboxProps extends Omit<CheckboxWithLabelProps, 'value' | 'onChange'> {
  name: string;
  defaultValue?: boolean;
}

const ControlledCheckbox: React.FC<ControlledCheckboxProps> = ({
  name,
  defaultValue = false,
  ...props
}) => {
  const form = useFormContext();

  const { field } = useController({
    control: form.control,
    name,
    defaultValue,
  });

  return <CheckboxWithLabel {...props} value={field.value} onChange={field.onChange} />;
};

export default ControlledCheckbox;
