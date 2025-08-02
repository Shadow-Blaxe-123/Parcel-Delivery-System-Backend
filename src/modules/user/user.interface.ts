export enum UserRole {
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  address: string;
  role: UserRole;
  isBlocked?: boolean;
  isDeleted?: boolean;
}
