import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import uniqueId from 'lodash/uniqueId';
import DatePicker from 'react-native-date-picker';

import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ScreenProps } from '@utils/navigation';
import { ExtendedTheme } from '@types';
import Button from '@components/shared/Button';
import BaseLayout from '@components/layout/BaseLayout';
import { IDefect } from '@entities/entities';
import IssueCard from '@components/IsssueCard';
import Typography from '@components/shared/Typography';
import DateRangePickerModal from '@components/DateRangerPickerModal';
import dayjs from 'dayjs';
import { useDefects } from '@api/queries/defects.queries';
import { useQueryClient } from '@tanstack/react-query';
import useUserStore from '@store/user.store';

const DashboardScreen: React.FC<ScreenProps<'Dashboard'>> = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [date, setDate] = useState({
    startDate: dayjs().subtract(7, 'day').toISOString(),
    endDate: dayjs().toISOString(),
  });

  // const queryClient = useQueryClient();
  // queryClient.removeQueries([]);
  // useUserStore.getState().setUser();

  const [openDatePicker, setOpenDatePicker] = useState(false);

  const defectsQuery = useDefects({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc', ...date });

  const defects = React.useMemo(
    () => defectsQuery.data?.pages?.map(page => page.docs || []).flat() ?? [],
    [defectsQuery.data],
  );

  const handleCardPress = useCallback((id: string) => {
    navigation.navigate('Issue', { id });
  }, []);

  const fetchMore = React.useCallback(() => {
    defectsQuery.fetchNextPage();
  }, [defectsQuery.fetchNextPage]);

  return (
    <BaseLayout style={styles.container}>
      <FlatList<IDefect>
        data={defects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <IssueCard item={item} onPress={handleCardPress} />}
        onEndReached={fetchMore}
        refreshing={defectsQuery.isLoading}
        onRefresh={defectsQuery.refetch}
        ListEmptyComponent={
          <View style={styles.emptyHeaderWrapper}>
            <Typography color="dark" weight="bold" size="small" mb={10} style={styles.noSearch}>
              No issues found
            </Typography>
          </View>
        }
      />
      <View style={styles.bottomMenu}>
        <Button
          textColor="dark"
          backgroundColor="background"
          style={[styles.menuBtn, styles.lightBlue]}
          borderColor="border"
          borderless
          onPress={() => navigation.navigate('AddIssue')}
        >
          Add new Issue
        </Button>

        <Button
          textColor="accent"
          backgroundColor="lightBackground"
          style={styles.menuBtn}
          borderColor="border"
          borderless
        >
          Reports
        </Button>

        <Button
          textColor="accent"
          backgroundColor="background"
          style={styles.menuBtn}
          borderColor="border"
          borderless
          onPress={() => setOpenDatePicker(true)}
        >
          <MIcon name="calendar-month-outline" size={24} />
        </Button>
      </View>

      <DateRangePickerModal
        startDate={date.startDate}
        endDate={date.endDate}
        isVisible={openDatePicker}
        onApply={setDate}
        onHide={() => setOpenDatePicker(false)}
      />
    </BaseLayout>
  );
};

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
    },
    headerContainer: {
      padding: theme.spacing.md,
    },
    emptyHeaderWrapper: {
      paddingVertical: theme.spacing.xxl,
      backgroundColor: theme.colors.white,
    },
    noSearch: { alignSelf: 'center' },
    bottomMenu: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: theme.spacing.md,
    },
    menuBtn: {
      paddingVertical: theme.spacing.sm,
    },
    lightBlue: {
      backgroundColor: '#78a9e3',
    },
  });

export default DashboardScreen;
