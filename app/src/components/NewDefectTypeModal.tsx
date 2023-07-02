import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import ReactNativeModal from 'react-native-modal';

import Icon from 'react-native-vector-icons/MaterialIcons';

import type { ExtendedTheme } from '@types';
import { DefaultModalProps } from '@entities/common';
import ControlledEditText from './form/ControlledEditText';
import { FormProvider, useForm } from 'react-hook-form';
import { ICreateDefectTypeRequest } from '@entities/requests';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateDefectType } from '@api/queries/defectTypes.queries';
import Button from './shared/Button';

interface NewDefectTypeModalProps extends DefaultModalProps {}

const schema: yup.ObjectSchema<ICreateDefectTypeRequest> = yup.object({
  type: yup.string().required().trim(),
});

const NewDefectTypeModal: React.FC<NewDefectTypeModalProps> = ({ isVisible, onHide }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const form = useForm<ICreateDefectTypeRequest>({
    resolver: yupResolver(schema),
  });

  const createDefectType = useCreateDefectType();

  const handleSubmit = form.handleSubmit(data => {
    createDefectType.mutate(data, {
      onSuccess: () => {
        form.reset();
        onHide();
      },
    });
  });

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackButtonPress={onHide}
      onBackdropPress={onHide}
      style={styles.modal}
    >
      <FormProvider {...form}>
        <View style={styles.container}>
          <ControlledEditText
            label="Defect Type"
            placeholder="Enter name for defect type"
            name="type"
          />

          <View style={styles.buttonContainer}>
            <Button
              textColor="accent"
              backgroundColor="background"
              style={styles.menuBtn}
              borderColor="border"
              borderless
              onPress={onHide}
              disabled={createDefectType.isLoading}
            >
              Cancel
            </Button>

            <Button
              style={styles.menuBtn}
              borderless
              onPress={handleSubmit}
              isLoading={createDefectType.isLoading}
              disabled={createDefectType.isLoading}
            >
              Add
            </Button>
          </View>
        </View>
      </FormProvider>
    </ReactNativeModal>
  );
};

export default NewDefectTypeModal;

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    modal: {},
    container: {
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: theme.spacing.md
    },

    menuBtn: {
      flex: 1,
      borderWidth: 1,
      width: 100,
    },
  });
