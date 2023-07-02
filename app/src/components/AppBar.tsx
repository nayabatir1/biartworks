import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { ExtendedTheme } from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Typography from './shared/Typography';
import Button from './shared/Button';

interface AppBarProps extends NativeStackHeaderProps {}

const AppBar: React.FC<AppBarProps> = ({ navigation, back, route }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.actionWrapper}>
        {back ? (
          <Icon name="arrow-left" size={24} color={theme.colors.dark} onPress={navigation.goBack} />
        ) : null}
      </View>

      <Typography weight="bold" align="center" size={18}>
        Flex N Gate
      </Typography>

      <View style={styles.actionWrapper}>
        <Button
          backgroundColor="white"
          borderColor="border"
          style={styles.search}
          onPress={() => navigation.navigate('Search')}
        >
          <Icon name="magnify" color={theme.colors.accent} size={18} />
        </Button>
      </View>
    </View>
  );
};

export default AppBar;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.white,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
      paddingTop: theme.spacing.lg,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    search: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      width: 35,
      marginLeft: 'auto',
      borderWidth: 1,
    },
    actionWrapper: {
      width: 80,
    },
  });
