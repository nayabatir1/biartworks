import http from '@api/http';
import { ApiResponse } from '@entities/common';
import { SocketMessage } from '@entities/entities';

export const fetchChats = (defectId: string) =>
  http.get<ApiResponse<SocketMessage[]>>(`/chat/defect/${defectId}`);
