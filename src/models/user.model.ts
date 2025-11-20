/**
 * User domain model.
 *
 * This interface describes the shape of a User object persisted in Firestore
 * and used throughout the application. Fields marked optional may be omitted
 * in certain contexts (for example `id` is assigned by Firestore).
 */
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