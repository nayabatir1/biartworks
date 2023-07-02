export type JWTPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
  groupIds?: string[];
};
