import { useMutation, useQuery, useQueryClient } from "react-query";
import convertQueryToString from "../shared/convertQueryToString";
import {
  deleteUser,
  getUsers,
  getUsersWithGroupId,
  updateUser,
} from "../request/users.request";
import { onAPIError } from "../Utils/error";
import { Query, UpdateUser } from "../shared/types";
import { onAPISuccess } from "../Utils/success";

export const useGetUsers = (query: Query, id: string | undefined) =>
  useQuery({
    queryKey: ["users", id, query],
    queryFn: async () => {
      const queries = convertQueryToString(query);

      if (id) {
        const res = await getUsersWithGroupId(queries, id);

        return res;
      }

      const res = await getUsers(queries);

      return res;
    },
    onError: onAPIError,
  });

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteUser(id);
      return res;
    },
    onSuccess: (res) => {
      onAPISuccess(res);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdateUser }) => {
      const res = await updateUser(id, body);

      return res;
    },
    onSuccess: (res) => {
      onAPISuccess(res);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: onAPIError,
  });
};
