export interface ITestimonios {
  id?: string;
  fullName: string;
  age?: number;
  occupation: string;
  content: string;
  score: number;
  createdAt?: Date;
  isApproved?: boolean;
  isActive?: boolean;
  imagen?: string;
  user?: {
    id: string;
  };
}
