export interface IPaginationQuery {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ISignup {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface IOtpRequest {
  email: string;
}

export interface IResetPasswordRequest {
  password: string;
  confirmPassword: string;
  otp: number;
}

export interface TokenResponse {
  token: string;
  name: string;
  email: string;
  role: string;
  groupId: string;
}

export interface IDefectsRequest extends IPaginationQuery {
  startDate?: string;
  endDate?: string;
}

export interface ICreateDefectTypeRequest {
  type: string;
}

export interface ICreateDefectRequest {
  partNo: string;
  imageIds: string[];
  defectTypeId: string;
  userGroupId: string;
}

export interface IUpdateDefectRequest {
  defectId: string;
  imageIds: string[];
}
