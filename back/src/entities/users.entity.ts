import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Subscription } from "./subscription.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: 'boolean', default: true })
    isUser: boolean;

    @ManyToOne(() => Subscription, (subscription) => subscription.user)
    @JoinColumn({ name: "ID_suscription" })
    subscription: Subscription;
}
