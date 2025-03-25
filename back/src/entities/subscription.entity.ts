import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity";
import { MembershipPlan } from "./membership.plan.entity";
import { Payment } from "./payment.entity";

@Entity("subscription")
export class Subscription {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.subscription)
    @JoinColumn({ name: "ID_User" })
    user: User;

    @ManyToOne(() => MembershipPlan, (membershipPlan) => membershipPlan.subscriptions)
    @JoinColumn({ name: "ID_MembershipPlan" })
    membershipPlan: MembershipPlan;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @OneToMany(() => Payment, (payment) => payment.subscription)
    payments: Payment[];
}
