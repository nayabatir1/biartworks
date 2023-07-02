import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addUserGroups,
  editUserGroups,
  getUserGroups,
  removeUserGroups,
} from "../request/userGroups.request";
import { onAPIError } from "../Utils/error";
import { onAPISuccess } from "../Utils/success";
import { Query, UserGroupsBody } from "../shared/types";
import convertQueryToString from "../shared/convertQueryToString";

export const useGetUserGroups = (query: Query) =>
  useQuery({
    queryKey: ["user-groups", query],
    queryFn: async () => {
      const queries = convertQueryToString(query);

      const res = await getUserGroups(queries);

      return res;
    },
  });

export const useAddUserGroups = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UserGroupsBody) => {
      const res = await addUserGroups(body);

      return res;
    },
    onError: onAPIError,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
      onAPISuccess(res);
    },
  });
};

export const useRemoveUserGroups = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await removeUserGroups(id);

      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
      onAPISuccess(res);
    },
    onError: onAPIError,
  });
};

export const useEditUserGroups = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ body, id }: { body: UserGroupsBody; id: string }) => {
      const res = await editUserGroups(id, body);

      return res;
    },
    onError: onAPIError,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
      onAPISuccess(res);
    },
  });
};
