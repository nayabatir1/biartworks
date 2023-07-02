import http from '@api/http';
import { ApiResponse, TPagination } from '@entities/common';
import { IUserGroup } from '@entities/entities';
import { IPaginationQuery } from '@entities/requests';

export const fetchUserGroups = (payload: IPaginationQuery) => {
  const query = new URLSearchParams({
    page: payload.page.toString(),
    limit: payload.limit.toString(),
  });

  if (payload.sortOrder) query.append('sortOrder', payload.sortOrder);
  if (payload.sortBy) query.append('sortBy', payload.sortBy);
  return http.get<ApiResponse<{ docs: Array<IUserGroup>; pagination: TPagination }>>(
    `/user-groups?${query}`,
  );
};
