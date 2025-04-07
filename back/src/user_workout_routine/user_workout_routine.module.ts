import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWorkoutRoutine } from '../entities/user_workout_routine.entity';
import { UserWorkoutRoutineRepository } from './user_workout_routine.repository';
import { UserWorkoutRoutineController } from './user_workout_routine.controller';
import { UserWorkoutRoutineService } from './user_workout_routine.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserWorkoutRoutine])],
  controllers: [UserWorkoutRoutineController],
  providers: [UserWorkoutRoutineService, UserWorkoutRoutineRepository],
  exports: [UserWorkoutRoutineService],
})
export class UserWorkoutRoutineModule {}
