import { StyleSheet, TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '@types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Sound from 'react-native-sound';
import Slider from '@react-native-community/slider';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import Typography from '@components/shared/Typography';
import { IMessage } from '@entities/entities';

const getAudioTimeString = (seconds: number) => {
  const h = parseInt(String(seconds / (60 * 60)), 10);
  const m = parseInt(String((seconds % (60 * 60)) / 60), 10);
  const s = parseInt(String(seconds % 60), 10);

  if (h === 0) {
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  }

  return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
};

const AudioMessage: React.FC<{ url: string; containerStyle?: StyleProp<ViewStyle> }> = ({
  url,
  containerStyle,
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const sound = React.useRef<Sound>();

  const [duration, setDuration] = React.useState(0);
  const [playSecond, setPlaySecond] = React.useState(0);
  const [playState, setPlayState] = React.useState<'playing' | 'paused' | 'completed'>('paused');
  const [isSliderEditing, setIsSliderEditing] = React.useState(false);

  const playAudio = () => {
    sound.current = new Sound(url, Sound.MAIN_BUNDLE, err => {
      if (err) {
        Toast.show({
          type: 'error',
          text1: err.message,
        });

        return;
      }

      setDuration(sound.current?.getDuration() ?? 0);

      // Play the sound with an onEnd callback
      sound.current?.play(success => {
        if (success) {
          setPlayState('paused');
        } else {
          setPlayState('paused');
          sound.current?.setCurrentTime(0);
        }
      });
    });
  };

  const toggle = () => {
    if (sound.current) {
      if (sound.current.isPlaying()) {
        sound.current.pause();
        setPlayState('paused');
      } else {
        sound.current.play();
        setPlayState('playing');
      }
    } else {
      playAudio();
      setPlayState('playing');
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (
        sound.current &&
        sound.current?.isLoaded() &&
        playState === 'playing' &&
        !isSliderEditing
      ) {
        sound.current.getCurrentTime(seconds => {
          setPlaySecond(seconds);
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [playState, isSliderEditing]);

  const handleSliderEditing = (value: number) => {
    sound.current?.setCurrentTime(value);
    setPlaySecond(value);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity onPress={toggle}>
        <Icon
          name={playState === 'paused' ? 'play' : 'pause'}
          size={24}
          color={theme.colors.accent}
        />
      </TouchableOpacity>

      <Slider
        minimumValue={0}
        maximumValue={duration}
        style={styles.slider}
        value={playSecond}
        onTouchStart={() => setIsSliderEditing(true)}
        onTouchEnd={() => setIsSliderEditing(false)}
        onValueChange={handleSliderEditing}
        maximumTrackTintColor={theme.colors.accent}
        minimumTrackTintColor={theme.colors.dark}
        thumbTintColor={theme.colors.accent}
      />

      <Typography color="darkBorder" size={12}>
        {getAudioTimeString(playSecond)}
      </Typography>
    </View>
  );
};

export default AudioMessage;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: wp(60),
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    slider: {
      flex: 1,
    },
  });
