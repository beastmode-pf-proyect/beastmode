import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity";
import { MembershipPlan } from "./membership.plan.entity";

@Entity("subscriptions")
export class Subscription {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // Relación ManyToOne con User
    @ManyToOne(() => User, (user) => user.subscriptions)
    @JoinColumn({ name: "user_id" }) 
    user: User;

    // Relación ManyToOne con MembershipPlan
    @ManyToOne(() => MembershipPlan, (membershipPlan) => membershipPlan.subscriptions)
    @JoinColumn({ name: "membership_plan_id" })
    membershipPlan: MembershipPlan;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({ default: false })
    isPago: boolean;

    @Column({ default: true })
    isActive: boolean;
}
