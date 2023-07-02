import { ApiResponseError } from '@api/http';
import { createDefectType, fetchDefectsTypes } from '@api/requests/defectTypes.request';
import { IDefectType } from '@entities/entities';
import { ICreateDefectRequest, ICreateDefectTypeRequest, IPaginationQuery } from '@entities/requests';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { onAPIError } from '@utils/index';
import Toast from 'react-native-toast-message';

export const useDefectTypes = (payload: IPaginationQuery) =>
  useQuery({
    queryKey: ['defect-types', payload],
    queryFn: async () => {
      const res = await fetchDefectsTypes(payload);

      return res.data;
    },
    onError: onAPIError,
  });

export const useCreateDefectType = () => {
  const queryClient = useQueryClient();

  return useMutation<IDefectType, ApiResponseError, ICreateDefectTypeRequest>({
    mutationFn: async payload => {
      const res = await createDefectType(payload);

      return res.data;
    },
    onError: onAPIError,
    onSuccess: () => {
      queryClient.invalidateQueries(['defect-types']);

      Toast.show({
        type: 'success',
        text1: 'Defect Type added',
      });
    },
  });
};
