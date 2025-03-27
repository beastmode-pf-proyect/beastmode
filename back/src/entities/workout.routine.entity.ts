import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './users.entity';

@Entity('workout_routine')
export class WorkoutRoutine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  
  @Column()
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.subscription)
  users: User[];
}