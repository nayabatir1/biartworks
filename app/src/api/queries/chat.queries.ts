import { fetchChats } from '@api/requests/chat.requests';
import { useQuery } from '@tanstack/react-query';
import { onAPIError } from '@utils/index';

export const useChats = (defectId: string) =>
  useQuery({
    queryKey: ['chat', defectId],
    queryFn: async () => {
      const res = await fetchChats(defectId);

      return res.data;
    },
    onError: onAPIError,
  });
