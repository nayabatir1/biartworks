import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import ReactNativeModal from 'react-native-modal';

import Icon from 'react-native-vector-icons/MaterialIcons';

import type { ExtendedTheme } from '@types';
import { DefaultModalProps } from '@entities/common';

interface ImageOptionModalProps extends DefaultModalProps {
  onCamera: () => void;
  onGallery: () => void;
}

const ImageOptionModal: React.FC<ImageOptionModalProps> = ({
  isVisible,
  onHide,
  onCamera,
  onGallery,
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const handlePress = (
    cb: ImageOptionModalProps['onCamera'] | ImageOptionModalProps['onGallery'],
  ) => {
    cb();
    onHide();
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackButtonPress={onHide}
      onBackdropPress={onHide}
      style={styles.modal}
    >
      <View style={styles.container}>
        <Icon
          name="camera-alt"
          color={theme.colors.accent}
          size={58}
          onPress={() => handlePress(onCamera)}
        />
        <Icon
          name="photo"
          color={theme.colors.accent}
          size={58}
          onPress={() => handlePress(onGallery)}
        />
      </View>
    </ReactNativeModal>
  );
};

export default ImageOptionModal;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    modal: {},
    container: {
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: theme.spacing.lg,
    },
  });
