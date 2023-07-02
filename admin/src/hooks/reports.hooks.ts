import { useQuery } from "react-query";
import convertQueryToString from "../shared/convertQueryToString";
import { getReports } from "../request/reports.request";
import { Query } from "../shared/types";
import { onAPIError } from "../Utils/error";

export const useGetReports = (query: Query) =>
  useQuery({
    queryKey: ["user-groups", query],
    queryFn: async () => {
      const queries = convertQueryToString(query);

      const res = await getReports(queries);

      return res;
    },
    onError: onAPIError,
  });
