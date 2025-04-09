import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Exercise } from '../entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExerciseRepository {
    [x: string]: any;    
    constructor(
        @InjectRepository(Exercise)
        private readonly repository: Repository<Exercise>
    ) {}

    async createExercise(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
        const exercise = this.repository.create(createExerciseDto);
        return await this.repository.save(exercise);
    }

    async findAllExercises(): Promise<Exercise[]> {
        return await this.repository.find();
    }

    async findExerciseById(id: string): Promise<Exercise> {
        return await this.repository.findOne({ where: { id } });
    }

    async updateExercise(id: string, updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
        await this.repository.update(id, updateExerciseDto);
        return this.findExerciseById(id);
    }

    async delete(id: string): Promise<void> {
        await this.repository.update(id, { isActive: false });
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.repository.count({ where: { id } });
        return count > 0;
    }
    
    async findOneById(id: string): Promise<Exercise | null> {
        return this.repository.findOne({ where: { id } });
    }
    
}