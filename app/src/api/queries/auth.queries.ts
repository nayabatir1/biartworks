import { ApiResponseError } from '@api/http';
import { login, resetPassword, sendOtp, signup } from '@api/requests/auth.requests';
import { IUser } from '@entities/entities';
import {
  ILogin,
  IOtpRequest,
  IResetPasswordRequest,
  ISignup,
  TokenResponse,
} from '@entities/requests';
import { useMutation } from '@tanstack/react-query';
import { onAPIError } from '@utils/index';

export const useSignup = () =>
  useMutation<TokenResponse, ApiResponseError, ISignup>({
    mutationFn: async payload => {
      const res = await signup(payload);

      return res.data;
    },
    onSuccess: () => {},
    onError: onAPIError,
  });

export const useLogin = () =>
  useMutation<TokenResponse, ApiResponseError, ILogin>({
    mutationFn: async payload => {
      const res = await login(payload);

      console.log(res);

      return res.data;
    },
    onError: onAPIError,
  });

export const useSendOtp = () =>
  useMutation<null, ApiResponseError, IOtpRequest>({
    mutationFn: async payload => {
      const res = await sendOtp(payload);

      return res.data;
    },
    onError: onAPIError,
  });

export const useResetPassword = () =>
  useMutation<null, ApiResponseError, IResetPasswordRequest>({
    mutationFn: async payload => {
      const res = await resetPassword(payload);

      return res.data;
    },
    onError: onAPIError,
  });
