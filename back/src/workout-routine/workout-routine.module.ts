import { Module } from '@nestjs/common';
import { WorkoutRoutineService } from './workout-routine.service';
import { WorkoutRoutineController } from './workout-routine.controller';
import { WorkoutRoutineRepository } from './workout-routine.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutRoutine } from 'src/entities/workout.routine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutRoutine])],
  controllers: [WorkoutRoutineController],
  providers: [WorkoutRoutineService, WorkoutRoutineRepository],
})
export class WorkoutRoutineModule {}
