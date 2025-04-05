import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { WorkoutRoutine } from './workout.routine.entity';
import { Exercise } from './exercise.entity';

@Entity('routine_exercise')
export class RoutineExercise {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WorkoutRoutine, (routine) => routine.routineExercises)
    @JoinColumn({ name: 'workout_routine_id' })
    workoutRoutine: WorkoutRoutine;

    @ManyToOne(() => Exercise, (exercise) => exercise.routineExercises)
    @JoinColumn({ name: 'exercise_id' })
    exercise: Exercise;

    @Column({ type: 'int', nullable: true })
    sets: number;

    @Column({ type: 'int', nullable: true })
    reps: number;

    @Column({ type: 'int', nullable: true })
    restSeconds: number;

    @Column({ type: 'int', nullable: true })
    order: number;

    @Column({ default: true })
    isActive: boolean;
}
