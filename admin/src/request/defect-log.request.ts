import http from "../Utils/http";
import { ReportCount, Root } from "../shared/types";

export const getDefectCount = () =>
  http.get<Root<ReportCount[]>>("/api/defect-log");
