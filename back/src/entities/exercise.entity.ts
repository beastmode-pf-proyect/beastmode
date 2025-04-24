import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RoutineExercise } from './Routine.exercise.entity';

@Entity('exercise')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

    @Column({nullable: true})
    category: string;

    @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.exercise)
    routineExercises: RoutineExercise[];    

}
