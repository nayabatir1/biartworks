import http from "../Utils/http";
import { PaginationData, Reports, Root } from "../shared/types";

export const getReports = (query: string) =>
  http.get<Root<PaginationData<Reports>>>("/api/reports?" + query);
