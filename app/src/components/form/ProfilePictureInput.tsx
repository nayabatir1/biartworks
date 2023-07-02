import { Image, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import ImagePicker, { Image as ImagePickerImage } from 'react-native-image-crop-picker';
import ReactNativeModal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import Typography from '@components/shared/Typography';
import type { ExtendedTheme } from '../../types';

interface ProfilePictureInputProps {
  name: string;
  style?: StyleProp<ViewStyle>;
}

const ProfilePictureInput: React.FC<ProfilePictureInputProps> = ({ name, style }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const form = useFormContext();

  const controller = useController({
    control: form.control,
    name,
    defaultValue: form.getValues(name) ?? undefined,
  });

  const value = useWatch({
    control: form.control,
    name,
    defaultValue: form.getValues(name) ?? undefined,
  });

  const [open, setOpen] = React.useState(false);
  const toggle = React.useCallback(() => {
    setOpen(o => !o);
  }, [setOpen]);

  const handleOpen = async (mode: 'camera' | 'upload') => {
    try {
      let image: ImagePickerImage;

      if (mode === 'camera') {
        image = await ImagePicker.openCamera({
          width: 1024,
          height: 1024,
          cropping: true,
          useFrontCamera: true,
        });
      } else {
        image = await ImagePicker.openPicker({
          width: 1024,
          height: 1024,
          cropping: true,
        });
      }

      image.filename = String(image.path).split('/')[String(image.path).split('/').length - 1];

      controller.field.onChange(image);
      toggle();
    } catch (err) {
      if (err instanceof Error) {
        Toast.show({
          type: 'error',
          text1: 'Oops!',
          text2: err?.message ?? 'Error',
        });
      }
      toggle();
    }
  };

  return (
    <View style={style}>
      <TouchableOpacity style={styles.pictureButton} onPress={toggle}>
        {value?.path ? <Image source={{ uri: value?.path }} style={styles.image} /> : null}
        <View style={styles.upload}>
          <Icon name="camera" size={24} color={theme.colors.white} style={styles.uploadIcon} />
        </View>
      </TouchableOpacity>

      <ReactNativeModal
        isVisible={open}
        onBackButtonPress={toggle}
        onBackdropPress={toggle}
        onSwipeComplete={toggle}
        useNativeDriverForBackdrop
        swipeDirection={['down']}
        style={styles.modal}
      >
        <View style={styles.content}>
          <Typography weight="bold">Profile Picture</Typography>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => handleOpen('camera')}>
              <View style={styles.iconContainer}>
                <Icon name="camera" size={24} color={theme.colors.white} />
              </View>
              <Typography style={styles.buttonText} size={14} mt={4} weight="bold">
                Camera
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer} onPress={() => handleOpen('upload')}>
              <View style={styles.iconContainer}>
                <Icon name="image-multiple" size={24} color={theme.colors.white} />
              </View>
              <Typography style={styles.buttonText} size={14} mt={4} weight="bold">
                Gallery
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </ReactNativeModal>
    </View>
  );
};

export default ProfilePictureInput;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    pictureButton: {
      backgroundColor: theme.colors.background,
      width: 160,
      height: 160,
      borderRadius: 80,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    buttonContainer: {
      borderRadius: 12,
      marginRight: theme.spacing.xxl,
      alignItems: 'center',
      marginVertical: theme.spacing.md,
    },
    buttonText: {},
    image: {
      width: 160,
      height: 160,
      borderRadius: 80,
    },
    upload: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: 20,
      padding: 8,
    },
    uploadIcon: {},
    modal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    content: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.text,
      borderWidth: 1,
      padding: theme.spacing.md,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    buttons: {
      flexDirection: 'row',
    },
    iconContainer: {
      backgroundColor: theme.colors.primary,
      padding: 8,
      borderRadius: 24,
    },
  });
