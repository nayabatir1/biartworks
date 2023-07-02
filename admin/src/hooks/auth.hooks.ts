import { useMutation } from "react-query";
import { forgotPassword, resetPassword, signin } from "../request/auth.request";
import {
  SigninBody,
  forgotPasswordBody,
  resetPasswordBody,
} from "../shared/types";
import { onAPIError } from "../Utils/error";
import useStore from "../store/UserStore";
import { onAPISuccess } from "../Utils/success";

export const useSignin = () =>
  useMutation({
    mutationFn: async (body: SigninBody) => {
      const res = await signin(body);

      return res;
    },
    onSuccess: (res) => {
      const auth = useStore.getState().authenticate;
      auth(res.data.token);
      window.location.replace("/");
    },
    onError: onAPIError,
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: async (body: forgotPasswordBody) => {
      const res = await forgotPassword(body);

      return res;
    },
    onSuccess: onAPISuccess,
    onError: onAPIError,
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: async (body: resetPasswordBody) => {
      const res = await resetPassword(body);

      return res;
    },
    onSuccess: onAPISuccess,
    onError: onAPIError,
  });
