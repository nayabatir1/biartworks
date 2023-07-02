import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '@types';
import { Menu, MenuOption, MenuOptions, MenuTrigger, renderers } from 'react-native-popup-menu';
import Typography from '@components/shared/Typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  error?: string;
}

const HOURS = Array.from({ length: 13 }, (_, i) => (i >= 9 ? i.toString() : `0${i + 1}`));
const MINUTES = Array.from({ length: 60 }, (_, i) => (i > 9 ? i.toString() : `0${i}`));
const TIME = ['AM', 'PM'];

/**
 * Time value if formatted as hh:mm A
 * Example: 09:28 AM
 */

const convertStringToTime = (value: string) => {
  const [time, meridiem] = value.split(' ');

  const [hour, minute] = time.split(':');

  return [hour, minute, meridiem];
};

const TimeSelect: React.FC<TimeSelectProps> = ({ style, value, onChange, error }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const currentHour = React.useMemo(() => dayjs().format('hh'), []);
  const currentMinute = React.useMemo(() => dayjs().format('mm'), []);
  const currentMeridiem = React.useMemo(() => dayjs().format('A'), []);

  const [hour, setHour] = React.useState(currentHour);
  const [minute, setMinute] = React.useState(currentMinute);
  const [meridiem, setMeridiem] = React.useState(currentMeridiem);

  React.useEffect(() => {
    if (/^\d\d[:]\d\d (AM|PM)$/.test(value)) {
      const time = convertStringToTime(value);

      setHour(time[0]);
      setMinute(time[1]);
      setMeridiem(time[2]);
    }
  }, [value]);

  const handleHourChange = (hr: string) => {
    setHour(hr);
    onChange(`${hr}:${minute} ${meridiem}`);
  };

  const handleMinuteChange = (min: string) => {
    setMinute(min);
    onChange(`${hour}:${min} ${meridiem}`);
  };

  const handleMeridiemChange = (mm: string) => {
    setHour(mm);
    onChange(`${hour}:${minute} ${mm}`);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <Menu renderer={renderers.Popover} rendererProps={{ anchorStyle: { display: 'none' } }}>
          <MenuTrigger>
            <View style={styles.menuButton}>
              <Typography>{hour}</Typography>
              <Icon name="chevron-down" size={24} color="#85868A" />
            </View>
          </MenuTrigger>
          <MenuOptions>
            {HOURS.map(time => (
              <MenuOption
                key={time}
                customStyles={{
                  optionWrapper: hour === time ? styles.optionWrapperActive : styles.optionWrapper,
                  optionText:
                    hour === time
                      ? styles.optionTextActive
                      : currentHour === time
                      ? styles.optionTextCurrent
                      : styles.optionText,
                }}
                text={time}
                onSelect={() => handleHourChange(time)}
              />
            ))}
          </MenuOptions>
        </Menu>

        <Typography style={styles.separator}>:</Typography>

        <Menu renderer={renderers.Popover} rendererProps={{ anchorStyle: { display: 'none' } }}>
          <MenuTrigger>
            <View style={styles.menuButton}>
              <Typography>{minute}</Typography>
              <Icon name="chevron-down" size={24} color="#85868A" />
            </View>
          </MenuTrigger>
          <MenuOptions>
            <ScrollView style={styles.scrollView}>
              {MINUTES.map(time => (
                <MenuOption
                  key={time}
                  customStyles={{
                    optionWrapper:
                      minute === time ? styles.optionWrapperActive : styles.optionWrapper,
                    optionText:
                      minute === time
                        ? styles.optionTextActive
                        : currentMinute === time
                        ? styles.optionTextCurrent
                        : styles.optionText,
                  }}
                  text={time}
                  onSelect={() => handleMinuteChange(time)}
                />
              ))}
            </ScrollView>
          </MenuOptions>
        </Menu>

        <Typography style={styles.separator} />

        <Menu renderer={renderers.Popover} rendererProps={{ anchorStyle: { display: 'none' } }}>
          <MenuTrigger>
            <View style={styles.menuButton}>
              <Typography>{meridiem}</Typography>
              <Icon name="chevron-down" size={24} color="#85868A" />
            </View>
          </MenuTrigger>
          <MenuOptions>
            {TIME.map(time => (
              <MenuOption
                key={time}
                customStyles={{
                  optionWrapper:
                    meridiem === time ? styles.optionWrapperActive : styles.optionWrapper,
                  optionText:
                    meridiem === time
                      ? styles.optionTextActive
                      : currentMeridiem === time
                      ? styles.optionTextCurrent
                      : styles.optionText,
                }}
                text={time}
                onSelect={() => handleMeridiemChange(time)}
              />
            ))}
          </MenuOptions>
        </Menu>
      </View>

      {error ? (
        <Typography color="error" size={11}>
          {error}
        </Typography>
      ) : null}
    </View>
  );
};

export default TimeSelect;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      marginVertical: theme.spacing.lg,
    },
    menuButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionText: {
      ...theme.fonts.regular,
      fontSize: theme.fontSize.text,
      color: theme.colors.text,
    },
    optionTextActive: {
      ...theme.fonts.bold,
      fontSize: theme.fontSize.text,
      color: theme.colors.white,
    },
    optionTextCurrent: {
      ...theme.fonts.regular,
      fontSize: theme.fontSize.text,
      color: theme.colors.primary,
    },
    optionWrapper: {
      backgroundColor: theme.colors.background,
    },
    optionWrapperActive: {
      backgroundColor: theme.colors.primary,
    },
    scrollView: {
      maxHeight: hp(50),
    },
    separator: {
      marginHorizontal: theme.spacing.md,
    },
  });
