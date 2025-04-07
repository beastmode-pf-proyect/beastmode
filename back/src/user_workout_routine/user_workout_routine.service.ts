import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserWorkoutRoutine } from '../entities/user_workout_routine.entity';
import { UserWorkoutRoutineRepository } from './user_workout_routine.repository';
import { CreateUserWorkoutDto } from './dto/create-user_workout_routine.dto';
import { UpdateUserWorkoutDto } from './dto/update-user_workout_routine.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class UserWorkoutRoutineService {
  constructor(
    private readonly repository: UserWorkoutRoutineRepository,
  ) {}

  async create(data: CreateUserWorkoutDto): Promise<UserWorkoutRoutine> {
    return this.repository.createRelation(data);
  }

  async findAll(): Promise<UserWorkoutRoutine[]> {
    return this.repository.findAllRelations();
  }

  async findById(id: string): Promise<UserWorkoutRoutine> {
    const relation = await this.repository.findRelationById(id);
    if (!relation) {
      throw new NotFoundException(`Relation with ID ${id} not found`);
    }
    return relation;
  }

  async update(id: string, data: UpdateUserWorkoutDto): Promise<UserWorkoutRoutine> {
    try {
      const updated = await this.repository.updateRelation(id, data);
      return updated;
    } catch (error) {
      if (error.message === 'Relación no encontrada') {
        throw new NotFoundException(`No se encontró la relación con ID ${id}`);
      }
      throw new InternalServerErrorException('Error al actualizar la relación');
    }
  }
  
  async delete(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException(`El ID "${id}" no tiene un formato UUID válido`);
    }
  
    const relation = await this.repository.findRelationById(id);
  
    if (!relation) {
      throw new NotFoundException(`No se encontró la relación con el ID "${id}"`);
    }
  
    await this.repository.deleteRelation(id);
  }
  
}
