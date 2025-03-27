import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subscription } from "./subscription.entity";
import { WorkoutRoutine } from "./workout.routine.entity";

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

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ type: 'enum', enum: ['admin', 'trainer', 'client'], default: 'client' })
    role: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => WorkoutRoutine, (workoutRoutine) => workoutRoutine.users)
    workoutRoutines: WorkoutRoutine[];

    @ManyToOne(() => Subscription, (subscription) => subscription.user)
    @JoinColumn({ name: "ID_suscription" })
    subscription: Subscription;
}
