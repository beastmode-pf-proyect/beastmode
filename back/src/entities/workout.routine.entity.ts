import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('workout_routine')
export class WorkoutRoutine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;
}