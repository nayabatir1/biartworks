export type SigninBody = {
  email: string;
  password: string;
};

export interface Root<T> {
  data: T;
  message: string;
}

interface Pagination {
  limit: number;
  currentPage: number;
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationData<T> {
  pagination: Pagination;
  docs: T[];
}

export interface Query {
  limit: number;
  page: number;
  sortOrder?: "asc" | "desc";
  sortBy?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface SigninData {
  token: string;
  name: string;
  email: string;
  role: string;
  groupId: string;
}

export interface forgotPasswordBody {
  email: string;
}

export interface resetPasswordBody {
  password: string;
  confirmPassword: string;
  otp: string;
}

export interface CompanyDetails {
  name?: string;
  address?: string;
  phone?: string;
  employeeCount?: string;
  location?: string;
  zip?: string;
  language?: string;
}

export interface UserGroups {
  type: string;
  id: string;
}

interface Group {
  type: string;
  id: string;
}

export interface User {
  name: string;
  id: string;
  email: string;
  groups: Group[];
  isActive: boolean;
  createdAt: string;
}

export interface UserGroupsBody {
  type: string;
}

interface Defect {
  partNo: string;
  defectType: DefectType;
}

interface DefectType {
  type: string;
}

interface UpdatedBy {
  name: string;
  id: string;
}

export interface Reports {
  id: string;
  defect: Defect;
  createdAt: string;
  status: string;
  actionTaken: string;
  updatedBy: UpdatedBy;
  updatedAt: string;
}
interface Group {
  type: string;
  id: string;
}

export interface User {
  name: string;
  id: string;
  email: string;
  group?: Group;
  isActive: boolean;
  createdAt: string;
}

export interface SendInviteBody {
  email: string;
  groupIds?: string[];
}

export interface ReportCount {
  _id: string;
  count: number;
}

export interface UpdateUser {
  groupIds: Array<string>;
}
