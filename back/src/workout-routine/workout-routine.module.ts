import { Module } from '@nestjs/common';
import { WorkoutRoutineService } from './workout-routine.service';
import { WorkoutRoutineController } from './workout-routine.controller';

@Module({
  controllers: [WorkoutRoutineController],
  providers: [WorkoutRoutineService],
})
export class WorkoutRoutineModule {}
