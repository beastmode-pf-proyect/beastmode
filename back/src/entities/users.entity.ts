import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subscription } from "./subscription.entity";
import { WorkoutRoutine } from "./workout.routine.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    auth0Id: string;

    @Column()
    name: string;
    
    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    imageUrl: string;
    
    @Column({ type: 'enum', enum:['admin', 'trainer', 'client'], default: 'client' })
    role: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Subscription, (subscription) => subscription.user)
    subscription: Subscription[];

    @ManyToMany(() => WorkoutRoutine, (workoutroutine) => workoutroutine.users)
    @JoinTable({
        name: "user_workout_routines",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "workout_routine_id", referencedColumnName: "id" }
    })
    workoutRoutines: WorkoutRoutine[];

}
