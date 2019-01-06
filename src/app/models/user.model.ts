export type UserId = number;

export interface IUser {
  id: UserId;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  role: string;
}
