import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subscription } from "./subscription.entity";
import { Testimony } from "./testimonies.entity";
import { UserWorkoutRoutine } from "./user_workout_routine.entity";


@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;


    @Column({nullable: true})

    name: string;
    
    @Column()
    email: string;

    @Column()
    password: string; 

    @Column({nullable: true})
    imageUrl: string;
    
    @Column({ type: 'enum', enum:['admin', 'trainer', 'client'], default: 'client' })
    role: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Subscription, (subscription) => subscription.user)
    subscription: Subscription[];

    @OneToMany(() => Testimony, (testimony) => testimony.user)
    testimonies: Testimony[];

    @OneToMany(() => UserWorkoutRoutine, (ur) => ur.user)
    userWorkoutRoutines: UserWorkoutRoutine[];
    


}