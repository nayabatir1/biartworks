import { ApiResponse } from '@entities/common';
import {
  ISignup,
  ILogin,
  TokenResponse,
  IOtpRequest,
  IResetPasswordRequest,
} from '@entities/requests';
import http from '../http';
import { IUser } from '@entities/entities';

export const signup = (data: ISignup) =>
  http.post<ApiResponse<TokenResponse>>('/auth/signup', data);

export const login = (data: ILogin) => http.post<ApiResponse<TokenResponse>>('/auth/signin', data);

export const sendOtp = (data: IOtpRequest) => http.post<ApiResponse<null>>('/auth/otp', data);

export const resetPassword = (data: IResetPasswordRequest) =>
  http.post<ApiResponse<null>>('/auth/reset-password', data);
