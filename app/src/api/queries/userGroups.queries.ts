import { fetchUserGroups } from '@api/requests/userGroups.requests';
import { IPaginationQuery } from '@entities/requests';
import { useQuery } from '@tanstack/react-query';
import { onAPIError } from '@utils/index';

export const useUserGroups = (payload: IPaginationQuery) =>
  useQuery({
    queryKey: ['user-groups', payload],
    queryFn: async () => {
      const res = await fetchUserGroups(payload);

      return res.data;
    },
    onError: onAPIError,
  });
