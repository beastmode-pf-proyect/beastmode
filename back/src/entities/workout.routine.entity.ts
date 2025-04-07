import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { RoutineExercise } from './Routine.exercise.entity';
import { UserWorkoutRoutine } from './user_workout_routine.entity';


@Entity("workout_routine")
export class WorkoutRoutine {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("text")
  description: string;

  @Column({ nullable: true, length: 255 })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;
  
  @OneToMany(() => UserWorkoutRoutine, (ur) => ur.routine)
  userRoutines: UserWorkoutRoutine[];  
  
  // Agrega esta nueva relación con RoutineExercise
  @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.routine)
  routineExercises: RoutineExercise[];
}