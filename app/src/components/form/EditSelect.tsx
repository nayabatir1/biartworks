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

type SelectOptionValue = string | number | null | undefined;

export interface SelectOption {
  label: string;
  value: SelectOptionValue;
}

export interface EditSelectProps {
  label: string;
  error?: string;
  options?: Array<SelectOption>;
  value?: SelectOptionValue;
  onChange?: (value: SelectOptionValue) => void;
  placholder?: string;
}

const BORDER_COLOR = '#BDBDBD';

const EditSelect: React.FC<EditSelectProps> = ({
  label,
  error,
  options = [],
  value,
  onChange,
  placholder,
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme, !!placholder), [theme, placholder]);

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
        <Typography style={styles.inputText}>{selectedLabel || placholder}</Typography>
        <Icon name="chevron-down" size={30} style={styles.icon} color={theme.colors.darkBorder} />
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

export default EditSelect;

const createStyles = (theme: ExtendedTheme, hasPlaceholder: boolean) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    content: {
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
    clearButton: {
      marginTop: theme.spacing.md,
    },
    errorText: {
      color: theme.colors.error,
      ...theme.fonts.regular,
      fontSize: 12,
    },
    input: {
      flexDirection: 'row',
      color: theme.colors.text,
      fontSize: theme.fontSize.large,
      paddingVertical: 8,
      backgroundColor: theme.colors.lightBackground,
      borderWidth: 2,
      borderColor: BORDER_COLOR,
      paddingHorizontal: theme.spacing.md,
      alignItems: 'center',
    },
    inputText: {
      flex: 1,
      color: hasPlaceholder ? theme.colors.darkBorder : theme.colors.text,
      ...theme.fonts.regular,
      fontSize: theme.fontSize.text,
      marginVertical: 6,
    },
    icon: {},
    view: {
      justifyContent: 'flex-end',
      margin: 0,
    },
  });
