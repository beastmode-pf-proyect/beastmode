import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subscription } from "./subscription.entity";
import { Testimony } from "./testimonies.entity";
import { UserWorkoutRoutine } from "./user_workout_routine.entity";
import { Role } from "./roles.entity";


@Entity("users2")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: 'text', unique: true, nullable: true})
    auth0_id: string;

    @Column({type: 'text', unique: true, nullable: true})
    email: string;

    @Column({ type: 'text', nullable: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    picture: string | null;

    @Column({ type: 'timestamp', default: () => 'NOW()' })
    last_login: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
    created_at: Date;

    @Column({ type: 'boolean', default: false })
    is_blocked: boolean;
    
    @Column({ 
        name: 'role_id', 
        type: 'uuid', 
        nullable: true,
        default: 'a039d031-b804-4b7b-afdf-f57424f2fbd9' // ID del rol "client" según tu imagen
      })
      roleId: string;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: 'role_id' }) // Esto crea la columna role_id en la tabla users2
    role: Role;

    @OneToMany(() => Subscription, (subscription) => subscription.user)
    subscription: Subscription[];

    @OneToMany(() => Testimony, (testimony) => testimony.user)
    testimonies: Testimony[];

    @OneToMany(() => UserWorkoutRoutine, (ur) => ur.user)
    userWorkoutRoutines: UserWorkoutRoutine[];



}