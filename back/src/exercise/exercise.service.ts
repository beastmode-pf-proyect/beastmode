import { Injectable, NotFoundException } from '@nestjs/common';
import { ExerciseRepository } from './exercise.repository';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from '../entities/exercise.entity';

@Injectable()
export class ExerciseService {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    return this.exerciseRepository.createExercise(createExerciseDto);
  }

  async findAll(): Promise<Exercise[]> {
    return this.exerciseRepository.findAllExercises();
  }

  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findExerciseById(id);
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return exercise;
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
    await this.findOne(id); // Verifica si existe
    return this.exerciseRepository.updateExercise(id, updateExerciseDto);
  }

  async delete(id: string): Promise<void> {
    await this.exerciseRepository.delete(id);
  }
}