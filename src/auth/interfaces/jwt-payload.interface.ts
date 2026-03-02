export interface JwtPayload {
  id: number;
  email: string;
  roleId: number;
  role?: string;
}
