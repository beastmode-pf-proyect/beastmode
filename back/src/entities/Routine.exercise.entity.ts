/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exercise } from './exercise.entity';
import { WorkoutRoutine } from './workout.routine.entity';

@Entity('routine_exercise')
export class RoutineExercise {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WorkoutRoutine, (routine) => routine.routineExercises)
    @JoinColumn({ name: 'routine_id' })
    routine: WorkoutRoutine;

    @ManyToOne(() => Exercise, (exercise) => exercise.routineExercises)
    @JoinColumn({ name: 'exercise_id' })
    exercise: Exercise;

    @Column({ type: 'int' })
    sets: number;

    @Column({ type: 'int' })
    reps: number;

    @Column({ type: 'int', nullable: true })
    duration: number; // en segundos, para ejercicios de tiempo

    @Column({ type: 'int', nullable: true })
    rest: number; // en segundos, descanso entre series

    @Column({ type: 'int' })
    order: number; // orden en la rutina

    @Column({ default: true })
    isActive: boolean;
}