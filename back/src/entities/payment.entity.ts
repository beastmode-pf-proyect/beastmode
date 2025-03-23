import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Subscription } from "./subscription.entity";

@Entity("payment")
export class Payment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("decimal")
    amount: number;

    @Column()
    paymentDate: Date;

    @Column()
    status: string;

    @ManyToOne(() => Subscription, (subscription) => subscription.payments)
    @JoinColumn({ name: "ID_suscription" })
    subscription: Subscription;
}
