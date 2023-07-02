import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import DateSplitButton, { DateSplitButtonProps } from './DateSplitButton';

interface ControlledDateSplitSelectProps
  extends Omit<
    DateSplitButtonProps,
    'startDate' | 'endDate' | 'onStartDateChange' | 'onEndDateChange' | 'error'
  > {
  startName: string;
  endName: string;
}

const ControlledDateSplitSelect: React.FC<ControlledDateSplitSelectProps> = ({
  startName,
  endName,
  ...props
}) => {
  const form = useFormContext();

  const startController = useController({
    name: startName,
    control: form.control,
  });

  const endController = useController({
    name: endName,
    control: form.control,
  });

  return (
    <DateSplitButton
      {...props}
      startDate={startController.field.value}
      endDate={endController.field.value}
      onStartDateChange={startController.field.onChange}
      onEndDateChange={endController.field.onChange}
      error={
        startController.fieldState.error?.message ??
        endController.fieldState.error?.message ??
        undefined
      }
    />
  );
};

export default ControlledDateSplitSelect;
