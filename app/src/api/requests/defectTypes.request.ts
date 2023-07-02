import http from '@api/http';
import { ApiResponse, TPagination } from '@entities/common';
import { IDefectType } from '@entities/entities';
import { ICreateDefectRequest, ICreateDefectTypeRequest, IPaginationQuery } from '@entities/requests';

export const fetchDefectsTypes = (payload: IPaginationQuery) => {
  const query = new URLSearchParams({
    page: payload.page.toString(),
    limit: payload.limit.toString(),
  });

  if (payload.sortOrder) query.append('sortOrder', payload.sortOrder);
  if (payload.sortBy) query.append('sortBy', payload.sortBy);
  return http.get<ApiResponse<{ docs: Array<IDefectType>; pagination: TPagination }>>(
    `/defect-type?${query}`,
  );
};

export const createDefectType = (payload: ICreateDefectTypeRequest) =>
  http.post<ApiResponse<IDefectType>>(`/defect-type`, payload);
