import { ApiResponse } from '@entities/common';
import http from '../http';
import { IUpload } from '@entities/entities';

export const upload = (data: FormData) =>
  http.post<ApiResponse<IUpload>>('/file', data, { hasFiles: true });
