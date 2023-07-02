import http from "../Utils/http";
import {
  Root,
  SigninBody,
  SigninData,
  forgotPasswordBody,
  resetPasswordBody,
} from "../shared/types";

export const signin = (body: SigninBody) =>
  http.post<Root<SigninData>>("/api/auth/signin", body);

export const forgotPassword = (body: forgotPasswordBody) =>
  http.post<Root<null>>("/api/auth/otp", body);

export const resetPassword = (body: resetPasswordBody) =>
  http.put<Root<null>>("/api/auth/reset-password", body);
