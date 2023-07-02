import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import ImageCropPicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import uniqueId from 'lodash/uniqueId';

import Icon from 'react-native-vector-icons/MaterialIcons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ImageCarousel from '@components/ImageCarousel';
import ScrollLayout from '@components/layout/ScrollLayout';
import { ScreenProps } from '@utils/navigation';
import { ExtendedTheme } from '@types';
import Button from '@components/shared/Button';
import Dropdown from '@components/shared/Dropdown';
import ImageOptionModal from '@components/ImageOptionModal';
import Scanner from '@components/Scanner';
import NewDefectTypeModal from '@components/NewDefectTypeModal';
import { useDefectTypes } from '@api/queries/defectTypes.queries';
import { useUpload } from '@api/queries/file.queries';
import { useCreateDefect } from '@api/queries/defects.queries';
import useUserStore from '@store/user.store';
import EditText from '@components/form/EditText';
import { useUserGroups } from '@api/queries/userGroups.queries';

const AddIssueScreen: React.FC<ScreenProps<'AddIssue'>> = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const user = useUserStore(state => state.user);

  const [open, setOpen] = useState(false);
  const [scanner, setScanner] = useState(false);
  const [partNo, setPartNo] = useState('');
  const [images, setImages] = useState<{ id: string; uri: string; file: ImageOrVideo }[]>([]);

  const [defectType, setDefectType] = useState<string>();
  const [newDefectModal, setNewDefectModal] = useState(false);
  const [userGroup, setUserGroup] = useState<string>();

  const defectTypesQuery = useDefectTypes({
    page: 1,
    limit: 100,
    sortOrder: 'desc',
    sortBy: 'createdAt',
  });

  const userGroupsQuery = useUserGroups({
    page: 1,
    limit: 100,
    sortOrder: 'desc',
    sortBy: 'createdAt',
  });

  const defectTypes = useMemo(
    () => defectTypesQuery.data?.docs?.map(item => ({ label: item.type, value: item.id })) || [],
    [defectTypesQuery.data],
  );

  const userGroups = useMemo(
    () => userGroupsQuery.data?.docs?.map(item => ({ label: item.type, value: item.id })) || [],
    [userGroupsQuery.data],
  );

  const upload = useUpload();
  const createDefect = useCreateDefect();

  const handlePicker = useCallback(async (pickerType: 'camera' | 'gallery') => {
    try {
      const file = await ImageCropPicker[pickerType === 'camera' ? 'openCamera' : 'openPicker']({});

      setImages(p => [{ id: uniqueId(), uri: file.path, ...p, file }]);
    } catch (err) {
      if (err instanceof Error) {
        Toast.show({
          type: 'error',
          text1: 'Oops!',
          text2: err?.message ?? 'Error',
        });
      }
    }
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!user) return;

    if (!defectType) {
      Toast.show({
        type: 'error',
        text1: 'Please select Defect type',
      });
      return;
    }

    if (!userGroup) {
      Toast.show({
        type: 'error',
        text1: 'Please select User Group',
      });
      return;
    }

    const imageUploadsPromises = images.map(item => {
      const formData = new FormData();

      item.file.filename = String(item.file.path).split('/')[
        String(item.file.path).split('/').length - 1
      ];

      formData.append('file', {
        uri: item.file.path,
        type: item.file.mime,
        name: item.file.filename,
        width: item.file.width,
        height: item.file.height,
      });

      return upload.mutateAsync(formData);
    });

    const imageUploads = await Promise.all(imageUploadsPromises);

    createDefect.mutate(
      {
        defectTypeId: defectType,
        imageIds: imageUploads.map(item => item.id),
        partNo,
        userGroupId: userGroup,
      },
      {
        onSuccess: () => navigation.navigate('Issue', { id: uniqueId() }),
      },
    );
  }, [defectType, user, userGroup]);

  const onRemove = useCallback((id: string) => {
    setImages(p => p.filter(item => item.id !== id));
  }, []);

  return (
    <ScrollLayout contentContainerStyle={styles.container}>
      <View style={styles.carousel}>
        <ImageCarousel images={images} onRemove={onRemove} />
      </View>
      <View style={styles.partInfo}>
        <EditText
          containerStyle={styles.partNo}
          value={partNo}
          onChangeText={setPartNo}
          placeholder="Part No."
        />

        <Icon name="groups" size={42} />
      </View>

      <View style={styles.partInfo}>
        <Dropdown
          value={defectType}
          options={defectTypes}
          label={'Select Defect Type'}
          style={{ marginRight: theme.spacing.md }}
          onChange={setDefectType}
          newButtonLabel="New Defect"
          onNewClick={() => setNewDefectModal(true)}
        />
      </View>

      <View style={styles.partInfo}>
        <Dropdown
          value={userGroup}
          options={userGroups}
          label={'Select User Group'}
          style={{ marginRight: theme.spacing.md }}
          onChange={setUserGroup}
        />
      </View>

      <Button
        disabled={!defectType}
        backgroundColor="success"
        borderless
        style={styles.confirm}
        onPress={handleConfirm}
      >
        Confirm
      </Button>

      <View style={styles.bottomMenu}>
        <Button
          textColor="accent"
          backgroundColor="background"
          style={styles.menuBtn}
          borderColor="border"
          borderless
          onPress={() => setOpen(true)}
        >
          <Icon name="camera-alt" size={32} />
        </Button>

        <Button
          textColor="accent"
          backgroundColor="background"
          style={styles.menuBtn}
          borderColor="border"
          borderless
          onPress={() => setScanner(true)}
        >
          <MIcon name="barcode" size={32} />
        </Button>
      </View>

      <ImageOptionModal
        onCamera={() => handlePicker('camera')}
        onGallery={() => handlePicker('gallery')}
        isVisible={open}
        onHide={() => setOpen(false)}
      />

      <Scanner isVisible={scanner} onHide={() => setScanner(false)} onConfirm={b => setPartNo(b)} />

      <NewDefectTypeModal isVisible={newDefectModal} onHide={() => setNewDefectModal(false)} />
    </ScrollLayout>
  );
};

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
      flex: 1,
    },
    carousel: {
      height: 200,
    },
    partInfo: {
      marginVertical: theme.spacing.md,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    partNo: {
      backgroundColor: theme.colors.lightBackground,
      width: 180,
      fontSize: theme.fontSize.medium,
      borderRadius: theme.rounded.sm,
    },
    confirm: {
      marginTop: 'auto',
      width: 100,
      marginLeft: 'auto',
      paddingVertical: theme.spacing.sm,
    },
    bottomMenu: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    menuBtn: {
      borderWidth: 1,
      width: 55,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
    },
  });

export default AddIssueScreen;
