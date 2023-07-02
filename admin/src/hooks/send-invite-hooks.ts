import { useMutation, useQueryClient } from "react-query";
import { sendInvite } from "../request/send-invite";
import { onAPIError } from "../Utils/error";
import { onAPISuccess } from "../Utils/success";
import { SendInviteBody } from "../shared/types";

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: SendInviteBody) => {
      const res = await sendInvite(body);

      return res;
    },
    onSuccess: (res) => {
      onAPISuccess(res);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: onAPIError,
  });
};
