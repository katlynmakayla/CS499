/* original code
export class User {
    email: string = '';
    name: string = '';

    // removed constructor per SonarCube instructions
}
*/

export interface UserProfile {
  climate: string;
  activityType: string;
  budgetRange: string;
  tripDuration: string;
}

export class User {
  _id?: string;
  email: string = '';
  name: string = '';
  role: 'user' | 'admin' = 'user';
  profile!: UserProfile;
  createdAt?: Date;
}