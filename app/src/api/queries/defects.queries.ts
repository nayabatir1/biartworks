import { ApiResponseError } from '@api/http';
import {
  createDefect,
  fetchDefects,
  getDefect,
  updateDefect,
} from '@api/requests/defects.requests';
import { IDefect } from '@entities/entities';
import { ICreateDefectRequest, IDefectsRequest, IUpdateDefectRequest } from '@entities/requests';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { onAPIError } from '@utils/index';
import Toast from 'react-native-toast-message';

export const useDefects = (payload: Omit<IDefectsRequest, 'page'>) =>
  useInfiniteQuery({
    queryKey: ['defects', payload],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetchDefects({ ...payload, page: pageParam });

      return res.data;
    },
    onError: onAPIError,
    getNextPageParam: (lastPage, _page) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined,
  });

export const useCreateDefect = () => {
  const queryClient = useQueryClient();

  return useMutation<IDefect, ApiResponseError, ICreateDefectRequest>({
    mutationFn: async payload => {
      const res = await createDefect(payload);

      return res.data;
    },
    onError: onAPIError,
    onSuccess: () => {
      queryClient.invalidateQueries(['defects']);

      Toast.show({
        type: 'success',
        text1: 'Defect added',
      });
    },
  });
};

export const useGetDefect = (defectId: string) =>
  useQuery({
    queryKey: ['defect', defectId],
    queryFn: async () => {
      const res = await getDefect(defectId);

      return res.data;
    },
  });

export const useUpdateDefect = () => {
  const queryClient = useQueryClient();

  return useMutation<IDefect, ApiResponseError, IUpdateDefectRequest>({
    mutationFn: async payload => {
      const res = await updateDefect(payload);

      return res.data;
    },
    onError: onAPIError,
    onSuccess: () => {
      queryClient.invalidateQueries(['defects']);
      queryClient.invalidateQueries(['defect']);

      Toast.show({
        type: 'success',
        text1: 'Defect updated',
      });
    },
  });
};
