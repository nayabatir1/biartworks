import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '@types';
import Animated, {
  Easing,
  useAnimatedStyle,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Typography from '@components/shared/Typography';
import Modal from 'react-native-modal';
import Button from '@components/shared/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Divider from '@components/shared/Divider';
import RadioButton from '@components/shared/RadioButton';

const BORDER_COLOR = '#BDBDBD';

type SelectOptionValue = string | number | null | undefined;

export interface SelectOption {
  label: string;
  value: SelectOptionValue;
}

export interface SelectProps {
  label: string;
  error?: string;
  options?: Array<SelectOption>;
  value?: SelectOptionValue;
  onChange?: (value: SelectOptionValue) => void;
}

const Select: React.FC<SelectProps> = ({ label, error, options = [], value, onChange }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme, !!error), [theme, error]);

  const [open, setOpen] = React.useState(false);

  const toggle = React.useCallback(() => {
    setOpen(o => !o);
  }, [setOpen]);

  const [selected, setSelected] = React.useState<SelectOptionValue>();

  const selectedLabel = React.useMemo(
    () => options.find(option => option.value === selected)?.label,
    [selected, options],
  );

  React.useEffect(() => {
    setSelected(options?.find(option => option.value === value)?.value);
  }, [value, options]);

  const errorTextStyle = useAnimatedStyle(
    () => ({
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
    }),
    [error],
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggle} style={styles.input}>
        <Typography style={[styles.inputText, !selectedLabel ? styles.inputTextPlaceholder : null]}>
          {selectedLabel ?? label}
        </Typography>

        <Icon name="chevron-down" size={24} style={styles.icon} />
      </TouchableOpacity>

      {error ? (
        <Animated.Text style={[styles.errorText, errorTextStyle]}>{error}</Animated.Text>
      ) : null}

      <Modal
        isVisible={open}
        onBackButtonPress={toggle}
        onBackdropPress={toggle}
        style={styles.view}
        onSwipeComplete={toggle}
        useNativeDriverForBackdrop
        swipeDirection={['down']}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Typography style={styles.headerText}>{label}</Typography>

            <TouchableOpacity onPress={toggle}>
              <Icon name="close" color={theme.colors.text} size={24} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={item => item.label + item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionContainer}
                onPress={() => {
                  setSelected(item.value);
                  if (onChange) onChange(item.value);
                  toggle();
                }}
              >
                <RadioButton selected={item.value === selected} label={item.label} />
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={Divider}
          />

          <Button
            onPress={() => {
              setSelected(undefined);
              if (onChange) onChange(undefined);
              toggle();
            }}
            style={styles.clearButton}
          >
            Clear
          </Button>
        </View>
      </Modal>
    </View>
  );
};

export default Select;

const createStyles = (theme: ExtendedTheme, isError?: boolean) =>
  StyleSheet.create({
    container: {
      marginVertical: theme.spacing.md,
    },
    content: {
      maxHeight: '80%',
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.text,
      borderWidth: 1,
      padding: theme.spacing.md,
      borderTopEndRadius: 20,
      borderTopStartRadius: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    headerText: {},
    optionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionText: {
      marginLeft: theme.spacing.sm,
    },
    clearButton: {
      marginTop: theme.spacing.md,
    },
    text: {
      color: theme.colors.text,
      ...theme.fonts.bold,
      fontSize: theme.fontSize.large,
      position: 'absolute',
      left: theme.spacing.sm,
    },
    required: {
      color: theme.colors.primary,
      ...theme.fonts.regular,
      position: 'absolute',
      fontSize: theme.fontSize.large,
      left: theme.spacing.sm,
      top: 0,
    },
    errorText: {
      color: theme.colors.error,
      ...theme.fonts.regular,
      fontSize: 12,
    },
    input: {
      flexDirection: 'row',
      alignItems: 'center',
      color: theme.colors.text,
      fontSize: theme.fontSize.large,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.lightBackground,
      borderWidth: 2,
      borderColor: isError ? theme.colors.error : BORDER_COLOR,
    },
    inputText: {
      flex: 1,
      color: theme.colors.text,
      ...theme.fonts.regular,
      fontSize: theme.fontSize.text,
    },
    inputTextPlaceholder: {
      color: theme.colors.darkBorder,
    },
    icon: {},
    view: {
      justifyContent: 'flex-end',
      margin: 0,
    },
  });
