import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '@types';
// import { isFunction } from 'lodash';
// import ClearIcon from '../../assets/svgs/ClearIcon';
// import SearchIcon from '../../assets/svgs/SearchIcon';

interface SearchInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  isClearable?: boolean;
  onSearch?: () => void;
}

const SearchInput = React.forwardRef<TextInput, SearchInputProps>(
  ({ style, isClearable = true, onSearch, onChangeText, ...props }, ref) => {
    const theme = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    const [value, setValue] = React.useState('');

    const handleClear = () => setValue('');

    const handleSearchChange = (text: string) => {
      setValue(text);
      onChangeText?.(text);
    };

    const debouncedChangeHandler = React.useCallback(handleSearchChange, [onChangeText]);

    return (
      <View style={[styles.container, style]}>
        <TextInput
          selectionColor={theme.colors.primary}
          {...props}
          style={styles.input}
          placeholderTextColor={theme.colors.darkBorder}
          ref={ref}
          value={value}
          onChangeText={debouncedChangeHandler}
        />
        {
          value && isClearable ? (
            <TouchableOpacity onPress={handleClear}>{/* <ClearIcon /> */}</TouchableOpacity>
          ) : onSearch ? (
            <TouchableOpacity onPress={onSearch}>{/* <SearchIcon /> */}</TouchableOpacity>
          ) : null
          // <SearchIcon />
        }
      </View>
    );
  },
);

export default SearchInput;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.darkBorder,
      borderRadius: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
    },
    input: {
      flex: 1,
      color: theme.colors.dark,
    },
  });
