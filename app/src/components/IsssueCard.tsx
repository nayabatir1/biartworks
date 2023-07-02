import React, { useMemo } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { IDefect } from '@entities/entities';
import { ExtendedTheme } from '@types';
import Typography from './shared/Typography';
import dayjs from 'dayjs';
import { statusColors } from '@utils/constants';
import { fetchFile } from '@utils/index';

type IssueCardProps = {
  item: IDefect;
  onPress?: (id: string) => void;
};

const IssueCard: React.FC<IssueCardProps> = ({ item, onPress }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyle(theme), [theme]);

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress?.(item.id)}>
      <View style={[styles.badge, { backgroundColor: statusColors[item.status] }]} />
      <Image
        source={{
          uri: fetchFile(item.images?.[0]?.id),
        }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Typography>{dayjs(item.createdAt).format('MMM DD, YYYY')}</Typography>
        <Typography color="white" style={styles.defect}>
          {item.defectType.type}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const createStyle = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      marginBottom: theme.spacing.md,
    },
    badge: {
      height: 40,
      width: 40,
      borderRadius: 9999,
      position: 'absolute',
      zIndex: 10,
    },
    image: {
      height: 150,
      resizeMode: 'cover',
      margin: theme.spacing.sm,
      backgroundColor: theme.colors.lightBackground,
    },
    info: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.sm,
    },

    defect: {
      backgroundColor: theme.colors.blue,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      overflow: 'hidden',
      borderRadius: theme.rounded.sm,
    },
  });

export default IssueCard;
