import 'react-native-reanimated';
import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import ReactNativeModal from 'react-native-modal';
import { useCameraDevices } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat, Barcode } from 'vision-camera-code-scanner';

import type { ExtendedTheme } from '@types';
import { DefaultModalProps } from '@entities/common';
import Typography from './shared/Typography';
import Button from './shared/Button';

interface ScannerProps extends DefaultModalProps {
  onConfirm: (barcode: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ isVisible, onHide, onConfirm }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;
  const [list, setList] = useState<Barcode[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const [frameProcessor, barcodes] =
    useScanBarcodes([BarcodeFormat.ALL_FORMATS], {
      checkInverted: true,
    }) || [];

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const handlePress = (barcode: Barcode) => {
    onConfirm(barcode.displayValue || barcode.rawValue || '');
    setList([]);
    setConfirmed(false);
    onHide();
  };

  const handleConfirm = () => {
    setList(barcodes);
    setConfirmed(true);
  };

  const retry = () => {
    setList([]);
    setConfirmed(false);
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackButtonPress={onHide}
      onBackdropPress={onHide}
      style={styles.modal}
    >
      {confirmed ? (
        <View style={styles.container}>
          <ScrollView centerContent contentContainerStyle={styles.scrollWrapper}>
            {list.map(item => (
              <Button key={item.rawValue} mb={10} mt={10} onPress={() => handlePress(item)}>
                {item.displayValue || item.rawValue || ''}
              </Button>
            ))}
          </ScrollView>
          <View style={styles.bottomMenu}>
            <Button
              textColor="accent"
              backgroundColor="background"
              style={styles.menuBtn}
              borderColor="border"
              borderless
              onPress={onHide}
            >
              Cancel
            </Button>

            <Button style={styles.menuBtn} borderless onPress={retry} disabled={!barcodes.length}>
              Retry
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          {!confirmed && device && hasPermission ? (
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              frameProcessor={frameProcessor}
              frameProcessorFps={5}
            />
          ) : null}

          <View style={styles.bottomMenu}>
            <Button
              textColor="accent"
              backgroundColor="background"
              style={styles.menuBtn}
              borderColor="border"
              borderless
              onPress={onHide}
            >
              Cancel
            </Button>

            <Button
              style={styles.menuBtn}
              borderless
              onPress={handleConfirm}
              disabled={!barcodes.length}
            >
              Confirm
            </Button>
          </View>
        </View>
      )}
    </ReactNativeModal>
  );
};

export default Scanner;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    modal: {
      flex: 1,
      margin: 0,
    },
    container: {
      backgroundColor: theme.colors.card,
      flex: 1,
    },
    scrollWrapper: {
      padding: theme.spacing.md,
    },

    bottomMenu: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      position: 'absolute',
      bottom: 0,
      width: '100%',
      gap: 5,
    },
    menuBtn: {
      flex: 1,
      borderWidth: 1,
      width: 55,
    },
  });
