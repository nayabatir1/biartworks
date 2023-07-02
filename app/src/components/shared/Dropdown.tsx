import { StyleProp, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import { Menu, MenuTrigger, MenuOptions, MenuOption, renderers } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '@types';
import Typography from '@components/shared/Typography';

type DropdownProps = {
  label?: string;
  style?: StyleProp<ViewStyle>;
  options: Array<{ value: string | undefined; label: string }>;
  value?: string | null | undefined;
  onChange?: (value?: string | undefined) => void;
  leftIconName?: string;
  labelStyle?: StyleProp<TextStyle>;
  onNewClick?: () => void;
  newButtonLabel?: string;
};

const Dropdown: React.FC<DropdownProps> = ({
  label = 'Select',
  style,
  options,
  value,
  onChange,
  leftIconName,
  labelStyle,
  newButtonLabel,
  onNewClick,
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <Menu
      style={style}
      renderer={renderers.ContextMenu}
      rendererProps={{ preferredPlacement: 'bottom' }}
    >
      <MenuTrigger
        customStyles={{
          triggerWrapper: styles.menu,
        }}
      >
        {leftIconName ? (
          <Icon name={leftIconName} size={16} color={theme.colors.dark} style={styles.rightIcon} />
        ) : null}
        <Typography size={14} mr={4} style={labelStyle}>
          {options.find(option => option?.value === value)?.label ?? label}
        </Typography>
        <Icon name="chevron-down" size={16} color={theme.colors.dark} style={styles.icon} />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: styles.menuContainer,
          optionWrapper: {
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.sm,
          },
        }}
      >
        {options.map(option => (
          <MenuOption
            key={`${option.value}-${option.label}`}
            onSelect={() => onChange?.(option.value)}
          >
            <Text>{option?.label || ''}</Text>
          </MenuOption>
        ))}

        {newButtonLabel ? (
          <MenuOption
            key={`${label}-new-button`}
            style={styles.newButtonWrapper}
            onSelect={onNewClick}
          >
            <Text style={styles.newButton}>{newButtonLabel}</Text>
          </MenuOption>
        ) : null}
      </MenuOptions>
    </Menu>
  );
};

export default Dropdown;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    menu: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.spacing.xs,
      backgroundColor: theme.colors.white,
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuLabelActive: {
      marginRight: theme.spacing.md,
      color: theme.colors.text,
    },
    menuLabel: {
      marginRight: theme.spacing.md,
      //   color: Color(theme.colors.text).alpha(0.54).rgb().string(),
    },
    menuOption: {
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
    },
    menuContainer: {
      marginTop: 42,
      borderRadius: 16,
    },
    icon: {
      marginLeft: 'auto',
    },
    rightIcon: {
      marginRight: 4,
    },
    newButton: {
      backgroundColor: theme.colors.lightBackground,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      margin: 'auto',
      borderRadius: theme.spacing.sm,
      overflow: 'hidden',
    },
    newButtonWrapper: {
      flexDirection: 'row',
    },
  });
