import http from "../Utils/http";
import {
  PaginationData,
  Root,
  UserGroups,
  UserGroupsBody,
} from "../shared/types";

export const getUserGroups = (query: string) =>
  http.get<Root<PaginationData<UserGroups>>>("/api/user-groups?" + query);

export const addUserGroups = (body: UserGroupsBody) =>
  http.post<Root<UserGroups>>("/api/user-groups", body);

export const removeUserGroups = (id: string) =>
  http.delete<Root<UserGroups>>("/api/user-groups/" + id);

export const editUserGroups = (id: string, body: UserGroupsBody) =>
  http.put<Root<UserGroups>>("/api/user-groups/" + id, body);
