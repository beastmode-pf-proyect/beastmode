import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinColumn } from 'typeorm';
import { User } from './users.entity';

@Entity('workout_routine')
export class WorkoutRoutine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true, length: 255 })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  // Relación ManyToMany con User
  @ManyToMany(() => User, (user) => user.workoutRoutines)
  users: User[];
}