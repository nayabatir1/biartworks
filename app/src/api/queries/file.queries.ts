import { ApiResponseError } from '@api/http';
import { upload } from '@api/requests/file.requests';
import { IUpload } from '@entities/entities';
import { useMutation } from '@tanstack/react-query';
import { onAPIError } from '@utils/index';

export const useUpload = () => {
  return useMutation<IUpload, ApiResponseError, FormData>({
    mutationFn: async payload => {
      const res = await upload(payload);

      return res.data;
    },
    onError: onAPIError,
  });
};
