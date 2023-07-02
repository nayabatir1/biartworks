import { useMutation, useQuery } from "react-query";
import {
  getCompanyDetails,
  updateCompanyDetails,
} from "../request/company.request";
import { onAPISuccess } from "../Utils/success";
import { CompanyDetails } from "../shared/types";
import { onAPIError } from "../Utils/error";

export const useGetCompanyDetails = () =>
  useQuery({
    queryKey: ["company"],
    queryFn: async () => {
      const res = await getCompanyDetails();

      return res;
    },
  });

export const useUpdateCompanyDetails = () =>
  useMutation({
    mutationFn: async (body: CompanyDetails) => {
      const res = await updateCompanyDetails(body);

      return res;
    },
    onSuccess: onAPISuccess,
    onError: onAPIError,
  });
