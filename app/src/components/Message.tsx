import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Typography from './shared/Typography';
import { SocketMessage } from '@entities/entities';
import { ExtendedTheme } from '@types';
import dayjs from 'dayjs';
import AudioMessage from './AudioMessage';
import { fetchFile } from '@utils/index';
import useUserStore from '@store/user.store';
type MessageProps = {
  item: SocketMessage;
};

const Message: React.FC<MessageProps> = ({ item }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const user = useUserStore(state => state.user);

  return (
    <View style={styles.container}>
      <View style={[styles.row, item.sender.name === user?.name ? styles.selfRow : undefined]}>
        <Typography color="dark" weight="bold" size={14}>
          {item.sender.name}
        </Typography>
        <Typography color="accent" ml={10} size={14}>
          {dayjs(item.createdAt).format('h:mm A')}
        </Typography>
      </View>

      <View
        style={[styles.textWrapper, item.sender.name === user?.name ? styles.selfRow : undefined]}
      >
        <Icon name="circle" color="green" />
        <View style={[styles.msg, item.sender.name === user?.name ? styles.self : styles.other]}>
          {item.file ? (
            <AudioMessage url={fetchFile(item.file?.id)} />
          ) : (
            <Typography size={17} >{item.text}</Typography>
          )}
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    msg: {
      backgroundColor: theme.colors.white,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      overflow: 'hidden',
    },
    self: {
      borderBottomRightRadius: theme.rounded.md,
      paddingRight: theme.spacing.md,
      justifyContent: 'flex-end',
    },
    other: {
      borderBottomLeftRadius: theme.rounded.md,
      paddingLeft: theme.spacing.md,
    },
    textWrapper: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    selfRow: {
      justifyContent: 'flex-end',
    },
  });

export default Message;
