export interface UserData {
  id: string;
  name: string;
  email: string;
  subscription: Subscription[];
}

export interface Subscription {
  id: string;
  user: UserData;
  membershipPlan: MembershipPlan;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration: string;
  isActive: boolean;
}
