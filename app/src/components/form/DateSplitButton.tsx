import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '@types';
import Button from '@components/shared/Button';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import Typography from '@components/shared/Typography';

export interface DateSplitButtonProps {
  style?: StyleProp<ViewStyle>;
  startDate?: Date | null;
  endDate?: Date | null;
  onStartDateChange?: (value?: Date | null) => void;
  onEndDateChange?: (value?: Date | null) => void;
  error?: string;
  startLabel?: string;
  endLabel?: string;
}

const DateSplitButton: React.FC<DateSplitButtonProps> = ({
  style,
  startDate: startDateValue,
  endDate: endDateValue,
  onStartDateChange,
  onEndDateChange,
  error,
  startLabel = 'Select\nDate From',
  endLabel = 'Select\nDate To',
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const [startDate, setStartDate] = React.useState<Date | undefined | null>(null);
  const [endDate, setEndDate] = React.useState<Date | undefined | null>(null);

  const [isStartOpen, setIsStartOpen] = React.useState(false);
  const [isEndOpen, setIsEndOpen] = React.useState(false);

  React.useEffect(() => {
    setStartDate(startDateValue);
  }, [startDateValue]);

  React.useEffect(() => {
    setEndDate(endDateValue);
  }, [endDateValue]);

  return (
    <View style={style}>
      <View style={styles.container}>
        <Button style={styles.button} fontSize={12} onPress={() => setIsStartOpen(true)}>
          {startDate ? dayjs(startDate).format('DD MMM, YY') : startLabel}
        </Button>
        <Button
          style={styles.button}
          fontSize={12}
          backgroundColor="white"
          textColor="text"
          borderColor="border"
          onPress={() => setIsEndOpen(true)}
        >
          {endDate ? dayjs(endDate).format('DD MMM, YY') : endLabel}
        </Button>
      </View>

      {error ? (
        <Typography size={11} color="error">
          {error}
        </Typography>
      ) : null}

      <DatePicker
        mode="date"
        date={startDate ?? dayjs().toDate()}
        modal
        open={isStartOpen}
        onConfirm={selectedDate => {
          setIsStartOpen(false);
          setStartDate(selectedDate);
          if (onStartDateChange) onStartDateChange(selectedDate);
        }}
        onCancel={() => {
          setIsStartOpen(false);
        }}
      />

      <DatePicker
        mode="date"
        date={endDate ?? dayjs().toDate()}
        modal
        open={isEndOpen}
        onConfirm={selectedDate => {
          setIsEndOpen(false);
          setEndDate(selectedDate);
          if (onEndDateChange) onEndDateChange(selectedDate);
        }}
        onCancel={() => {
          setIsEndOpen(false);
        }}
      />
    </View>
  );
};

export default DateSplitButton;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing.md,
    },
  });
