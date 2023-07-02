import React, { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { ScreenProps } from '@utils/navigation';
import { ExtendedTheme } from '@types';
import BaseLayout from '@components/layout/BaseLayout';
import { IDefect } from '@entities/entities';
import IssueCard from '@components/IsssueCard';
import Typography from '@components/shared/Typography';
import { useDefects } from '@api/queries/defects.queries';
import SearchInput from '@components/form/SearchInput';

const SearchScreen: React.FC<ScreenProps<'Search'>> = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const defectsQuery = useDefects({
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: deferredSearch,
  });

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
        ListHeaderComponentStyle={styles.headerStyle}
        ListHeaderComponent={
          <SearchInput value={search} onChangeText={setSearch} placeholder="Search" />
        }
        ListEmptyComponent={
          <View style={styles.emptyHeaderWrapper}>
            <Typography color="dark" weight="bold" size="small" mb={10} style={styles.noSearch}>
              No issues found
            </Typography>
          </View>
        }
      />
    </BaseLayout>
  );
};

const createStyles = (theme: ExtendedTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
    },
    emptyHeaderWrapper: {
      paddingVertical: theme.spacing.xxl,
      backgroundColor: theme.colors.white,
    },
    noSearch: { alignSelf: 'center' },
    headerStyle: {
      paddingTop: theme.spacing.md,
    },
  });

export default SearchScreen;
