import { Injectable, NotFoundException, } from '@nestjs/common';
import { RoutineExerciseRepository } from './routine_exercise.repository';
import { CreateRoutineExerciseDto } from './dto/create-routine_exercise.dto';
import { UpdateRoutineExerciseDto } from './dto/update-routine_exercise.dto';
import { RoutineExercise } from 'src/entities/Routine.exercise.entity';

@Injectable()
export class RoutineExerciseService {
    constructor(private readonly repository: RoutineExerciseRepository) {}

    async create(createDto: CreateRoutineExerciseDto): Promise<RoutineExercise> {
        const routineExercise = await this.repository.create(createDto);      
        return routineExercise;
}

    async findAll(): Promise<RoutineExercise[]> {
        return this.repository.findAll();
    }

    async findOne(id: string): Promise<RoutineExercise> {
        const routineExercise = await this.repository.findOne(id);
    
    if (!routineExercise) {
            throw new NotFoundException(`RoutineExercise with ID ${id} not found`);
    }
        return routineExercise;
    }

    async update(id: string, updateDto: UpdateRoutineExerciseDto): Promise<RoutineExercise> {
    // Verificar existencia
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const exists = await this.repository.findOne(id);
    if (!exists) {
        throw new NotFoundException(`RoutineExercise with ID ${id} not found`);
    }

    return this.repository.update(id, updateDto);
}

    async delete(id: string): Promise<void> {
        return this.repository.delete(id);
    }

    async findByRoutineId(routineId: string): Promise<RoutineExercise[]> {
        return this.repository.findByRoutineId(routineId);
    }
}