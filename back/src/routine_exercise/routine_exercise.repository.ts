/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoutineExercise } from 'src/entities/Routine.exercise.entity';
import { Repository, Connection } from 'typeorm';
import { CreateRoutineExerciseDto } from './dto/create-routine_exercise.dto';
import { UpdateRoutineExerciseDto } from './dto/update-routine_exercise.dto';
import { WorkoutRoutine } from 'src/entities/workout.routine.entity';
import { Exercise } from 'src/entities/exercise.entity';


@Injectable()
export class RoutineExerciseRepository {
    constructor(
        @InjectRepository(RoutineExercise)
        private readonly repository: Repository<RoutineExercise>,
        private readonly connection: Connection,
    ) {}

    async create(routineExerciseDto: CreateRoutineExerciseDto): Promise<RoutineExercise> {
        // Verificar que existan las entidades relacionadas
        const routineExists = await this.connection.getRepository(WorkoutRoutine).count({ 
            where: { id: routineExerciseDto.routineId } 
        });
        
        const exerciseExists = await this.connection.getRepository(Exercise).count({ 
            where: { id: routineExerciseDto.exerciseId } 
        });
    
        if (!routineExists || !exerciseExists) {
            throw new NotFoundException('Routine or Exercise not found');
        }
    
        // Crear la entidad con las relaciones
        const routineExercise = this.repository.create({
            ...routineExerciseDto,
            routine: { id: routineExerciseDto.routineId },
            exercise: { id: routineExerciseDto.exerciseId }
        });
    
        // Guardar y devolver con relaciones
        const saved = await this.repository.save(routineExercise);
        
        return this.repository.findOne({
            where: { id: saved.id },
            relations: ['routine', 'exercise']
        });
    }

    async findAll(): Promise<RoutineExercise[]> {
        return await this.repository.find({
            relations: ['routine', 'exercise']
        });
    }

    
    async findOne(id: string): Promise<RoutineExercise> {
        const exists = await this.repository.count({ where: { id } });
        
        if (exists === 0) {
            throw new NotFoundException(`RoutineExercise with ID ${id} not found`);
        }

        return this.repository.findOne({
            where: { id },
            relations: ['routine', 'exercise'] // Asegúrate de cargar las relaciones
        });
    }

    async update(id: string, updateDto: UpdateRoutineExerciseDto): Promise<RoutineExercise> {
        // Filtrar solo propiedades actualizables
        const updateData = {
            sets: updateDto.sets,
            reps: updateDto.reps,
            duration: updateDto.duration,
            rest: updateDto.rest,
            order: updateDto.order,
            isActive: updateDto.isActive
        };

        await this.repository.update(id, updateData);
        
        return this.repository.findOne({
            where: { id },
            relations: ['routine', 'exercise']
        });
}

async delete(id: string): Promise<void> {
    const exists = await this.repository.findOneBy({ id });
    if (!exists) {
        throw new NotFoundException('Resource not found');
    }
    await this.repository.update(id, { isActive: false });
}

    async findByRoutineId(routineId: string): Promise<RoutineExercise[]> {
        return await this.repository.find({
            where: { routine: { id: routineId }, isActive: true },
            relations: ['exercise'],
            order: { order: 'ASC' },
        });
    }
}