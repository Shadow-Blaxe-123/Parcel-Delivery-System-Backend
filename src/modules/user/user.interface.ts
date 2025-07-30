export enum UserRole {
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECIEVER = "RECIEVER",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  address: string;
  Role: UserRole;
  isBlocked?: boolean;
  isDeleted?: boolean;
}
