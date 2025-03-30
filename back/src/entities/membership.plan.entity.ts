import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subscription } from "./subscription.entity";

@Entity("membershipPlan")
export class MembershipPlan {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column("decimal")
    price: number;

    @Column()
    duration: string; 

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    description: string; 

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    description: string; 

    @OneToMany(() => Subscription, (subscription) => subscription.membershipPlan)
    subscriptions: Subscription[];
}