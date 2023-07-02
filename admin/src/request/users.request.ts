import http from "../Utils/http";
import { PaginationData, Root, UpdateUser, User } from "../shared/types";

export const getUsers = (query: string) =>
  http.get<Root<PaginationData<User>>>("/api/users?" + query);

export const getUsersWithGroupId = (query: string, id: string) =>
  http.get<Root<PaginationData<User>>>("/api/users/" + id + "?" + query);

export const deleteUser = (id: string) =>
  http.delete<Root<undefined>>("/api/users/" + id);

export const updateUser = (id: string, body: UpdateUser) =>
  http.put<Root<undefined>>("/api/users/" + id, body);
