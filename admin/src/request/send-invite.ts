import http from "../Utils/http";
import { Root, SendInviteBody } from "../shared/types";

export const sendInvite = (body: SendInviteBody) =>
  http.post<Root<unknown>>("/api/send-invite", body);
