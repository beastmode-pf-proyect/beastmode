import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutRoutineService } from './workout-routine.service';

describe('WorkoutRoutineService', () => {
  let service: WorkoutRoutineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutRoutineService],
    }).compile();

    service = module.get<WorkoutRoutineService>(WorkoutRoutineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
