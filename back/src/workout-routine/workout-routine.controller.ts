import { Controller } from '@nestjs/common';
import { WorkoutRoutineService } from './workout-routine.service';

@Controller('workout-routine')
export class WorkoutRoutineController {
  constructor(private readonly workoutRoutineService: WorkoutRoutineService) {}
}
