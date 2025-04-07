import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    JoinColumn,
} from 'typeorm';
import { User } from './users.entity';
import { WorkoutRoutine } from './workout.routine.entity';

@Entity('user_workout_routine')
export class UserWorkoutRoutine {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    routineId: string;

    @Column({ type: 'boolean', default: true }) 
    isActive: boolean;

    @ManyToOne(() => User, (user) => user.userWorkoutRoutines, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => WorkoutRoutine, (routine) => routine.userRoutines, { eager: true })
    @JoinColumn({ name: 'routineId' })
    routine: WorkoutRoutine;

    
}
