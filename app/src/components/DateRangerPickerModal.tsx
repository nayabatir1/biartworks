import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import ReactNativeModal from 'react-native-modal';

import type { ExtendedTheme } from '@types';
import { DefaultModalProps } from '@entities/common';
import Button from '@components/shared/Button';
import ControlledDatePicker from './form/ControlledDatePicker';
import dayjs from 'dayjs';
import Typography from './shared/Typography';

interface DateRangePickerModalProps extends DefaultModalProps {
  onApply?: (val: { startDate: string; endDate: string }) => void;
  startDate: string;
  endDate: string;
}

type FormProps = {
  startDate: Date | null;
  endDate: Date | null;
};

const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
  isVisible,
  onHide,
  onApply,
  startDate,
  endDate,
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const form = useForm<FormProps>();

  const onSubmit = form.handleSubmit(data => {
    onApply?.({
      startDate: dayjs(data.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(data.endDate).format('YYYY-MM-DD'),
    });
    onHide();
  });

  useEffect(() => {
    form.reset({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  }, []);

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackButtonPress={onHide}
      onBackdropPress={onHide}
      style={styles.modal}
    >
      <FormProvider {...form}>
        <View style={styles.container}>
          <Typography>Start Date</Typography>
          <ControlledDatePicker name="startDate" label="Start Date" />

          <Typography>End Date</Typography>
          <ControlledDatePicker name="endDate" label="End Date" />

          <View style={styles.buttonContainer}>
            <Button
              borderless
              textColor="primary"
              backgroundColor="white"
              textProps={{ weight: 'regular' }}
              onPress={onHide}
            >
              Cancel
            </Button>
            <Button borderless textColor="primary" backgroundColor="white" onPress={onSubmit}>
              Apply
            </Button>
          </View>
        </View>
      </FormProvider>
    </ReactNativeModal>
  );
};

export default DateRangePickerModal;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    modal: {},
    container: {
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: theme.spacing.lg,
    },
  });
