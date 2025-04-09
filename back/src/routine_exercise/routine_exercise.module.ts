import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExerciseModule } from '../exercise/exercise.module';
import { WorkoutRoutineModule } from '../workout-routine/workout-routine.module';
import { RoutineExercise } from 'src/entities/Routine.exercise.entity';
import { RoutineExerciseController } from './routine_exercise.controller';
import { RoutineExerciseService } from './routine_exercise.service';
import { RoutineExerciseRepository } from './routine_exercise.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([RoutineExercise]),
        ExerciseModule,
        WorkoutRoutineModule,
    ],
    controllers: [RoutineExerciseController],
    providers: [RoutineExerciseService, RoutineExerciseRepository],
    exports: [RoutineExerciseService],
})
export class RoutineExerciseModule {}