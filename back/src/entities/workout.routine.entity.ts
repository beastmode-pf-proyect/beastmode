import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { User } from './users.entity';
import { RoutineExercise } from './Routine.exercise.entity';

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

  @ManyToMany(() => User, (user) => user.workoutRoutines)
  users: User[];

  @Column({ nullable: true })
  created_by: string;

  @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.workoutRoutine)
  routineExercises: RoutineExercise[];
}
