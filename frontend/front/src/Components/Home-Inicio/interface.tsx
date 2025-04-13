export interface UserData {
  id: string;
  name: string;
  email: string;
  subscription?: Subscription[];
}

export interface Subscription {
  id: string;
  user: UserData;
  membershipPlan: MembershipPlan;
  startDate: Date;
  endDate: Date;
}

export interface MembershipPlan {
  id: string;
  name: string;
}
