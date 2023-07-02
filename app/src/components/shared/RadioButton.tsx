import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { ExtendedTheme } from '@types';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Typography from './Typography';

type TRadioButtonProps = { selected: boolean; label: string };

const INNER_WIDTH = 16;

const RadioButton: React.FC<TRadioButtonProps> = ({ selected, label }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const innerCircleStyle = useAnimatedStyle(() => ({
    width: withSpring(selected ? INNER_WIDTH : 0, { mass: 0.8 }),
    height: withSpring(selected ? INNER_WIDTH : 0, { mass: 0.8 }),
  }));

  return (
    <>
      <View style={styles.outerCircle}>
        <Animated.View style={[styles.innerCircle, innerCircleStyle]} />
      </View>
      <Typography size="small">{label}</Typography>
    </>
  );
};

export default RadioButton;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    outerCircle: {
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    innerCircle: {
      position: 'absolute',
      height: INNER_WIDTH,
      width: INNER_WIDTH,
      borderRadius: 24,
      backgroundColor: theme.colors.primary,
    },
  });
