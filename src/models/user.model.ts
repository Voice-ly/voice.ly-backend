export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  createdAt: Date;
  password: string;
  resetPasswordToken?: string;
}