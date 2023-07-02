import http from "../Utils/http";
import { CompanyDetails, Root } from "../shared/types";

export const getCompanyDetails = () =>
  http.get<Root<CompanyDetails>>("/api/company");

export const updateCompanyDetails = (body: CompanyDetails) =>
  http.patch<Root<CompanyDetails>>("/api/company", body);
