import React, { useMemo } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Slick, { SlickProps } from 'react-native-slick';

import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ExtendedTheme } from '@types';
import useUserStore from '@store/user.store';

export type ImageCarouselProps = SlickProps & {
  images: { uri: string; id: string }[];
  onRemove?: (id: string) => void;
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onRemove, ...props }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const user = useUserStore(state => state.user);

  return (
    <Slick style={styles.wrapper} {...props}>
      {images?.length ? (
        images.map(item => (
          <View key={item.id} style={styles.slide}>
            {onRemove ? (
              <MIcon
                name="delete"
                color={theme.colors.accent}
                size={28}
                style={styles.delete}
                onPress={() => onRemove(item.id)}
              />
            ) : null}
            <Image
              style={styles.image}
              source={{
                uri: item.uri,
                headers: {
                  Authorization: `Bearer ${user?.token}`,
                },
              }}
            />
          </View>
        ))
      ) : (
        <View style={styles.slide}></View>
      )}
    </Slick>
  );
};

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    wrapper: {
      height: 200,
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.lightBackground,
      position: 'relative',
    },
    image: {
      height: '100%',
      resizeMode: 'cover',
      width: '100%',
    },
    delete: {
      position: 'absolute',
      top: theme.spacing.md,
      right: theme.spacing.md,
      zIndex: 50,
    },
  });

export default ImageCarousel;
