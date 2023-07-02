import React from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import dayjs from 'dayjs';
import TimeSelect from './TimeSelect';

interface ControlledTimeSelectProps {
  name: string;
}

const ControlledTimeSelect: React.FC<ControlledTimeSelectProps> = ({ name }) => {
  const form = useFormContext();

  const controller = useController({
    control: form.control,
    name,
    defaultValue: form.getValues(name) ?? dayjs().format('hh:mm A'),
  });

  const value = useWatch({
    control: form.control,
    name,
    defaultValue: form.getValues(name) ?? dayjs().format('hh:mm A'),
  });

  return (
    <TimeSelect
      value={value}
      onChange={controller.field.onChange}
      error={controller.fieldState.error?.message}
    />
  );
};

export default ControlledTimeSelect;
