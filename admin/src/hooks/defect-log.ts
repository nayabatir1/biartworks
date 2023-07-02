import { useQuery } from "react-query";
import { getDefectCount } from "../request/defect-log.request";
import { onAPIError } from "../Utils/error";

export const useGetDefectCount = () =>
  useQuery({
    queryKey: ["defect-count"],
    queryFn: async () => {
      const res = await getDefectCount();

      return res;
    },
    onError: onAPIError,
  });
