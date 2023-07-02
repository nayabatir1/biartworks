import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '@types';
import RNDropdownPicker, { ItemType, ListModeType } from 'react-native-dropdown-picker';
import Animated, {
  Easing,
  useAnimatedStyle,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export interface DropdownPickerProps {
  items: Array<ItemType<string>>;
  value: string;
  onChange: (value: string) => void;
  onChangeSearchText: (text: string) => void;
  loading: boolean;
  error?: string;
  placeholder?: string;
  listMode?: ListModeType;
}

const BORDER_COLOR = '#BDBDBD';

const DropdownPicker: React.FC<DropdownPickerProps> = ({
  items,
  value: fieldValue,
  onChange,
  onChangeSearchText,
  loading,
  error,
  placeholder = '',
  listMode,
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const [open, setOpen] = React.useState(false);

  const errorTextStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: error
          ? withDelay(
              200,
              withSequence(
                withTiming(10, {
                  duration: 200,
                  easing: Easing.bounce,
                }),
                withTiming(0, {
                  duration: 200,
                  easing: Easing.bounce,
                }),
              ),
            )
          : 0,
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <RNDropdownPicker
        open={open}
        setOpen={setOpen}
        items={items}
        multiple={false}
        value={fieldValue}
        setValue={callback => onChange(callback(fieldValue) as string)}
        searchable
        disableLocalSearch
        onChangeSearchText={onChangeSearchText}
        loading={loading}
        style={styles.input}
        placeholder={placeholder}
        textStyle={styles.text}
        labelStyle={styles.label}
        listMode={listMode}
      />

      {error ? (
        <Animated.Text style={[styles.errorText, errorTextStyle]}>{error}</Animated.Text>
      ) : null}
    </View>
  );
};

export default DropdownPicker;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    input: {
      backgroundColor: theme.colors.lightBackground,
      borderWidth: 2,
      borderColor: BORDER_COLOR,
      borderRadius: 0,
    },
    text: {
      ...theme.fonts.regular,
      fontSize: theme.fontSize.medium,
      color: theme.colors.darkBorder,
    },
    label: {
      color: theme.colors.text,
      ...theme.fonts.regular,
    },
    container: {
      marginVertical: theme.spacing.md,
    },
    errorText: {
      color: theme.colors.error,
      ...theme.fonts.regular,
      fontSize: 12,
    },
  });
