import { InjectRepository } from '@nestjs/typeorm';
import { UserWorkoutRoutine } from '../entities/user_workout_routine.entity';
import { CreateUserWorkoutDto } from './dto/create-user_workout_routine.dto';
import { UpdateUserWorkoutDto } from './dto/update-user_workout_routine.dto';
import { Injectable, NotFoundException,} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { RoutineExerciseService } from 'src/routine_exercise/routine_exercise.service';
import { WorkoutRoutineService } from 'src/workout-routine/workout-routine.service';


@Injectable()
export class UserWorkoutRoutineRepository{

    constructor(@InjectRepository(UserWorkoutRoutine)
        private readonly repository: Repository<UserWorkoutRoutine>,
        private readonly userSevice: UsersService,
        private readonly WorkoutRoutineService: WorkoutRoutineService,
    ) {}

    async findAllRelations(): Promise<UserWorkoutRoutine[]> {
        return this.repository.find({ relations: ['user', 'routine'] });
    }

    async findRelationById(id: string): Promise<UserWorkoutRoutine> {
        return await this.repository.findOne({ where: { id }, relations: ['user', 'routine'] });
    }

    async createRelation(id: string, dto: CreateUserWorkoutDto): Promise<UserWorkoutRoutine> {
    
        const userIdBdd = await this.userSevice.getUserById( id );

        const routineBdd = await this.WorkoutRoutineService.getWorkoutRoutineById( dto.routineId );

        if(!routineBdd){
            throw new NotFoundException('Rutina no encontrada')
        }
    
        const relation = this.repository.create({
            userId: userIdBdd.id,
            routineId: dto.routineId,
            isActive: true,
        });
    
        
        if(!relation){
            throw new NotFoundException('Relación no creada')
        }

        return await this.repository.save(relation);
    }
    

    async updateRelation(id: string, dto: UpdateUserWorkoutDto): Promise<UserWorkoutRoutine> {
    
        const relation = await this.findRelationById(id);
    
        // Aplica los cambios del DTO a la entidad
        if (dto.isActive !== undefined) {
            relation.isActive = dto.isActive;
        }
    
        try {
            const saved = await this.repository.save(relation);
            return saved;
        } catch (error) {
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
