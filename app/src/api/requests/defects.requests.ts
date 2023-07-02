import http from '@api/http';
import { ApiResponse, TPagination } from '@entities/common';
import { IDefect } from '@entities/entities';
import { ICreateDefectRequest, IDefectsRequest, IUpdateDefectRequest } from '@entities/requests';

export const fetchDefects = (payload: IDefectsRequest) => {
  const query = new URLSearchParams({
    page: payload.page.toString(),
    limit: payload.limit.toString(),
  });

  if (payload.sortOrder) query.append('sortOrder', payload.sortOrder);
  if (payload.sortBy) query.append('sortBy', payload.sortBy);
  if (payload.search) query.append('search', payload.search);
  if (payload.startDate && payload.endDate) {
    query.append('startDate', payload.startDate);
    query.append('endDate', payload.endDate);
  }

  return http.get<ApiResponse<{ docs: Array<IDefect>; pagination: TPagination }>>(
    `/defects?${query}`,
  );
};

export const createDefect = (payload: ICreateDefectRequest) =>
  http.post<ApiResponse<IDefect>>(`/defects`, payload);

export const getDefect = (defectId: string) =>
  http.get<ApiResponse<IDefect>>(`/defects/${defectId}`);

export const updateDefect = ({ defectId, ...payload }: IUpdateDefectRequest) =>
  http.put<ApiResponse<IDefect>>(`/defects/${defectId}`, payload);
