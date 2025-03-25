import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutRoutineController } from './workout-routine.controller';
import { WorkoutRoutineService } from './workout-routine.service';

describe('WorkoutRoutineController', () => {
  let controller: WorkoutRoutineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutRoutineController],
      providers: [WorkoutRoutineService],
    }).compile();

    controller = module.get<WorkoutRoutineController>(WorkoutRoutineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
