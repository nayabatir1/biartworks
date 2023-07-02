import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ImageCarousel, { ImageCarouselProps } from '@components/ImageCarousel';
import { ScreenProps } from '@utils/navigation';
import { ExtendedTheme } from '@types';
import Button from '@components/shared/Button';
import Typography from '@components/shared/Typography';
import { IDefect, SocketMessage } from '@entities/entities';
import { statusColors, statusList } from '@utils/constants';

import Message from '@components/Message';
import BaseLayout from '@components/layout/BaseLayout';
import ImageOptionModal from '@components/ImageOptionModal';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Voice from '@react-native-voice/voice';
import { useGetDefect, useUpdateDefect } from '@api/queries/defects.queries';
import { fetchFile } from '@utils/index';
import { useUpload } from '@api/queries/file.queries';
import { useSocket } from '@socket/index';
import useUserStore from '@store/user.store';
import { useChats } from '@api/queries/chat.queries';

const audioRecorderPlayer = new AudioRecorderPlayer();

const IssueScreen: React.FC<ScreenProps<'Issue'>> = ({ route }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const ref = useRef<FlatList>(null);
  const socket = useSocket();
  const user = useUserStore(state => state.user);

  const [images, setImages] = useState<ImageCarouselProps['images']>([]);

  const [status, setStatus] = useState<IDefect['status']>('OPEN');
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [recording, setRecording] = React.useState({
    time: '0',
    sec: 0,
    started: false,
  });
  const [speech, setSpeech] = React.useState({
    recognized: false,
    started: false,
    results: [],
  });

  const defectQuery = useGetDefect(route.params.id);
  const chatQuery = useChats(route.params.id);
  const updateDefect = useUpdateDefect();
  const upload = useUpload();

  const handlePicker = useCallback(
    async (pickerType: 'camera' | 'gallery') => {
      if (!defectQuery.data?.id) return;

      try {
        const file = await ImageCropPicker[pickerType === 'camera' ? 'openCamera' : 'openPicker'](
          {},
        );

        const formData = new FormData();

        file.filename = String(file.path).split('/')[String(file.path).split('/').length - 1];

        formData.append('file', {
          uri: file.path,
          type: file.mime,
          name: file.filename,
          width: file.width,
          height: file.height,
        });

        const res = await upload.mutateAsync(formData);

        updateDefect.mutate({
          defectId: defectQuery.data.id,
          imageIds: [...defectQuery.data.images.map(item => item.id), res.id],
        });
      } catch (err) {
        if (err instanceof Error) {
          Toast.show({
            type: 'error',
            text1: 'Oops!',
            text2: err?.message ?? 'Error',
          });
        }
      }
    },
    [defectQuery.data],
  );

  const sendMessage = () => {
    socket?.emit('message', {
      defectId: defectQuery.data?.id,
      text,
    });
    setText('');
  };

  const handleStatusChange = useCallback(
    (item: IDefect['status']) => {
      if (statusList.findIndex(s => s === item) <= statusList.findIndex(s => s === status)) return;

      if (!text) {
        Toast.show({
          type: 'error',
          text1: 'Oops',
          text2: 'Please give a message before changing the status',
        });
        return;
      }

      socket?.emit('message', {
        defectId: defectQuery.data?.id,
        text,
        statusUpdated: true,
        status: item,
      });
      setStatus(item);
      setText('');
    },
    [text, status],
  );

  // record
  const onStartRecord = React.useCallback(async () => {
    await audioRecorderPlayer.startRecorder();

    audioRecorderPlayer.addRecordBackListener(e => {
      setRecording({
        started: true,
        sec: e.currentPosition,
        time: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      });
    });
  }, []);

  const onStopRecord = React.useCallback(async () => {
    const result = await audioRecorderPlayer.stopRecorder();

    audioRecorderPlayer.removeRecordBackListener();
    setRecording(p => ({
      ...p,
      started: false,
      sec: 0,
    }));

    const fd = new FormData();

    fd.append('file', {
      uri: result,
      type: 'audio/mpeg',
      name: `${user?.name}-${new Date().getTime()}.mp3`,
    });

    const res = await upload.mutateAsync(fd);

    socket?.emit('message', {
      defectId: defectQuery.data?.id,
      fileId: res.id,
    });
  }, []);

  const toggleRecording = React.useCallback(() => {
    if (recording.started) onStopRecord();
    else onStartRecord();
  }, [recording.started]);

  // #region speech
  useEffect(() => {
    Voice.onSpeechStart = () => setSpeech(p => ({ ...p, started: true }));
    Voice.onSpeechEnd = () => setSpeech(p => ({ ...p, started: false }));
    Voice.onSpeechError = () => setSpeech(p => ({ ...p, started: false }));

    Voice.onSpeechResults = e => setText(p => [p, ...(e.value || [])].join(' '));
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecognizing = useCallback(async () => {
    setSpeech({ started: false, results: [], recognized: false });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const stopRecognizing = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleRecognizing = React.useCallback(() => {
    if (recording.started) stopRecognizing();
    else startRecognizing();
  }, [recording.started]);
  // #endregion speech

  useEffect(() => {
    if (defectQuery.data?.images) {
      setImages(
        defectQuery.data.images.map(item => ({
          id: item.id,
          uri: fetchFile(item.id),
        })),
      );
    }
  }, [defectQuery.data?.images]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (data: SocketMessage) => {
        if (data.defectId === route.params.id) {
          setMessages(p => [...p, data]);
          setTimeout(() => ref.current?.scrollToEnd({ animated: true }), 200);
        }
      });
    }

    return () => {
      socket?.off('message');
    };
  }, [socket, route.params.id]);

  useEffect(() => {
    if (chatQuery.data?.length) {
      setMessages(chatQuery.data);
      setTimeout(() => ref.current?.scrollToEnd({ animated: false }), 500);
    }
  }, [chatQuery.data]);

  return (
    <BaseLayout style={styles.container}>
      <ImageCarousel images={images} />

      <View style={styles.row}>
        <Button
          textColor="accent"
          backgroundColor="lightBackground"
          style={styles.partNo}
          borderless
          fontSize={14}
        >
          {`Part No  ${defectQuery.data?.partNo || ''}`}
        </Button>

        <Button backgroundColor="blue" style={styles.partNo} borderless fontSize={14}>
          {defectQuery.data?.defectType?.type || ''}
        </Button>
      </View>

      <Typography size={14}> Status</Typography>

      <View style={styles.row}>
        {statusList.map(item => (
          <Button
            key={item}
            textColor={item === status ? 'white' : 'accent'}
            style={[
              styles.statusBtn,
              {
                backgroundColor:
                  item === status ? statusColors[item] : theme.colors.lightBackground,
              },
            ]}
            borderless
            fontSize={14}
            onPress={() => handleStatusChange(item)}
            textStyle={styles.statusBtnText}
          >
            {item}
          </Button>
        ))}
      </View>

      <FlatList<SocketMessage>
        ref={ref}
        data={messages}
        style={styles.messageWrapper}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Message item={item} />}
        refreshing={chatQuery.isLoading}
        onRefresh={chatQuery.refetch}
        ListEmptyComponent={
          <View style={styles.emptyHeaderWrapper}>
            <Typography color="dark" weight="bold" size="small" mb={10} align="center">
              No messages yet
            </Typography>
          </View>
        }
      />

      <View style={styles.bottomMenu}>
        {speech.started || recording.started ? null : (
          <Button
            textColor="accent"
            backgroundColor="background"
            style={styles.menuBtn}
            borderColor="border"
            borderless
            onPress={() => setOpen(true)}
            disabled={upload.isLoading}
          >
            <Icon name="camera-alt" size={32} />
          </Button>
        )}
        {speech.started ? null : (
          <Button
            style={styles.menuBtn}
            backgroundColor="background"
            borderless
            onPress={toggleRecording}
            disabled={upload.isLoading}
          >
            <MIcon
              name="record-rec"
              color={recording.started ? theme.colors.error : theme.colors.dark}
              size={38}
            />
          </Button>
        )}

        {recording.started ? null : (
          <TextInput
            placeholder="Type your message"
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            editable={!upload.isLoading}
          />
        )}

        {!speech.started && recording.started ? (
          <Typography style={styles.recordingTime} align="center">
            {recording.time}
          </Typography>
        ) : null}

        {recording.started ? null : (
          <Button
            style={styles.menuBtn}
            backgroundColor="background"
            borderless
            onPress={toggleRecognizing}
            disabled={upload.isLoading}
          >
            <MIcon
              name="microphone"
              color={speech.started ? theme.colors.error : theme.colors.dark}
              size={30}
            />
          </Button>
        )}

        {speech.started || recording.started ? null : (
          <Button
            style={styles.menuBtn}
            borderColor="border"
            borderless
            onPress={sendMessage}
            disabled={upload.isLoading}
          >
            <Icon name="send" size={24} />
          </Button>
        )}
      </View>

      <ImageOptionModal
        onCamera={() => handlePicker('camera')}
        onGallery={() => handlePicker('gallery')}
        isVisible={open}
        onHide={() => setOpen(false)}
      />
    </BaseLayout>
  );
};

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
    },
    row: {
      marginVertical: theme.spacing.sm,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    partNo: {
      paddingVertical: theme.spacing.sm,
      maxWidth: 250,
    },
    confirm: {
      width: 100,
      marginLeft: 'auto',
      paddingVertical: theme.spacing.sm,
      marginTop: 120,
    },
    bottomMenu: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: theme.spacing.md,
      gap: 3,
      alignItems: 'center',
    },
    menuBtn: {
      width: 45,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
    },

    statusBtn: {
      flex: 1,
      marginHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.sm,
    },
    statusBtnText: {
      textTransform: 'capitalize',
    },
    textInput: {
      flex: 1,
      paddingHorizontal: theme.spacing.sm,
    },
    emptyHeaderWrapper: {
      paddingVertical: theme.spacing.xxl,
      backgroundColor: theme.colors.white,
    },
    messageWrapper: {
      backgroundColor: theme.colors.lightBackground,
      marginHorizontal: -theme.spacing.md,
      padding: theme.spacing.md,
      flex: 1,
    },
    actionButton: {
      paddingHorizontal: 8,
    },
    recordingTime: {
      color: theme.colors.error,
      fontSize: theme.fontSize.medium,
      flex: 1,
    },
  });

export default IssueScreen;
