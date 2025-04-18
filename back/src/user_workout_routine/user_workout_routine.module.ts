import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWorkoutRoutine } from '../entities/user_workout_routine.entity';
import { UserWorkoutRoutineRepository } from './user_workout_routine.repository';
import { UserWorkoutRoutineController } from './user_workout_routine.controller';
import { UserWorkoutRoutineService } from './user_workout_routine.service';
import { UsersModule } from 'src/users/users.module';
import { RoutineExerciseModule } from 'src/routine_exercise/routine_exercise.module';
import { WorkoutRoutineModule } from 'src/workout-routine/workout-routine.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserWorkoutRoutine]), UsersModule, WorkoutRoutineModule],
  controllers: [UserWorkoutRoutineController],
  providers: [UserWorkoutRoutineService, UserWorkoutRoutineRepository, UsersModule, WorkoutRoutineModule],
  exports: [UserWorkoutRoutineService],
})
export class UserWorkoutRoutineModule {}
