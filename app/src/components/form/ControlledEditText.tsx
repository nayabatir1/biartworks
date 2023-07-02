import { useController, useFormContext, useWatch } from 'react-hook-form';
import { TextInput } from 'react-native';
import React from 'react';
import EditText, { EditTextProps } from './EditText';

export type ControlledEditTextProps = EditTextProps & {
  name: string;
  defaultValue?: string;
  onNext?: () => void;
};

const ControlledEditText = React.forwardRef<TextInput, ControlledEditTextProps>(
  ({ name, defaultValue, onNext, ...props }, ref) => {
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
      <EditText
        {...props}
        ref={ref}
        value={(typeof value === 'number' ? String(value) : value) ?? controller.field.value}
        onChangeText={controller.field.onChange}
        onSubmitEditing={onNext}
        blurOnSubmit={onNext === undefined}
        error={controller.fieldState.error?.message}
      />
    );
  },
);

ControlledEditText.displayName = 'ControlledEditText';

export default ControlledEditText;
