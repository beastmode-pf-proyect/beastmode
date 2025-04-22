import { Plan } from "../memberships/memberships";

export interface UserData {
  id: string;
  name: string;
  email: string;
  subscription: Subscription[];
}

export type Subscription = {
  id: string;
  user: UserData;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  MembershipPlan?: Plan;
};

// export interface MembershipPlan {
//   id: string;
//   name: string;
//   duration: string;
//   isActive?: boolean;
//   description?: string;
//   price: number;
// }
