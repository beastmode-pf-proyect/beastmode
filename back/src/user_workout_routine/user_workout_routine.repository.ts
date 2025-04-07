import { InjectRepository } from '@nestjs/typeorm';
import { UserWorkoutRoutine } from '../entities/user_workout_routine.entity';
import { CreateUserWorkoutDto } from './dto/create-user_workout_routine.dto';
import { UpdateUserWorkoutDto } from './dto/update-user_workout_routine.dto';
import { Injectable,} from '@nestjs/common';
import { Repository } from 'typeorm';


@Injectable()
export class UserWorkoutRoutineRepository{

    constructor(@InjectRepository(UserWorkoutRoutine)
        private readonly repository: Repository<UserWorkoutRoutine>,
    ) {}

    async findAllRelations(): Promise<UserWorkoutRoutine[]> {
        return this.repository.find({ relations: ['user', 'routine'] });
    }

    async findRelationById(id: string): Promise<UserWorkoutRoutine> {
        return this.repository.findOne({ where: { id }, relations: ['user', 'routine'] });
    }

    async createRelation(dto: CreateUserWorkoutDto): Promise<UserWorkoutRoutine> { 
    
        const relation = this.repository.create({
            userId: dto.userId,
            routineId: dto.routineId,
            isActive: true,
        });
    
        return await this.repository.save(relation);
    }
    

    async updateRelation(id: string, dto: UpdateUserWorkoutDto): Promise<UserWorkoutRoutine> {
        console.log('DTO recibido:', dto);
    
        const relation = await this.findRelationById(id);
        console.log('Entidad antes de actualizar:', relation);
    
        // Aplica los cambios del DTO a la entidad
        if (dto.isActive !== undefined) {
            relation.isActive = dto.isActive;
        }
    
        try {
            const saved = await this.repository.save(relation);
            console.log('Entidad después de guardar:', saved);
            return saved;
        } catch (error) {
            console.error('Error al guardar:', error);
            throw new Error('Error al guardar los cambios');
        }
    }
    

    async deleteRelation(id: string): Promise<void> {
        const relation = await this.findRelationById(id);
        if (!relation) throw new Error('Relación no encontrada');
    
        relation.isActive = false;
        await this.repository.save(relation);
    }
    
    
    
}
