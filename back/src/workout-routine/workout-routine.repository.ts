import { InjectRepository } from "@nestjs/typeorm";
import { updateWorkoutRoutineDto } from "src/dto/updateWorkoutRoutineDto";
import { WorkoutRoutine } from "src/entities/workout.routine.entity";
import { Repository } from "typeorm";


export class WorkoutRoutineRepository{
    constructor(
        @InjectRepository(WorkoutRoutine) private workoutRuotineRepository: Repository<WorkoutRoutine>,
    ){}


    async getWorkoutRoutines() : Promise <WorkoutRoutine[]> {

        const workoutRoutines = await this.workoutRuotineRepository.find()
        return workoutRoutines;
    
    }

    async getWorkoutRoutineById(id: string){

        const membership = await this.workoutRuotineRepository.findOneBy({ id })
        if(!membership){
            return 'Rutina no encontrada'
        }

        return membership
    }

    async updateWorkoutRoutine(id: string, updateWorkoutRoutine: updateWorkoutRoutineDto) {

        await this.workoutRuotineRepository.update( id, updateWorkoutRoutine)

        const updatedWorkoutRoutine = await this.workoutRuotineRepository.findOneBy({ id })

        return `Rutinas de ejercicios actualizada: ${updatedWorkoutRoutine.name}`

    }

    async createWorkoutRoutine(workoutRoutine: Partial<WorkoutRoutine>): Promise<WorkoutRoutine> {
        const createdWorkoutRoutine = await this.workoutRuotineRepository.save(workoutRoutine);
    
        if (!createdWorkoutRoutine) {
            throw new Error('No se pudo crear la rutina');
        }
    
        return createdWorkoutRoutine; // Devuelve el objeto directamente
    }

    async desactivateWorkoutRoutine(id:string){

        const findingWorkoutRoutine = await this.workoutRuotineRepository.findOneBy({ id })

        if(!findingWorkoutRoutine){
            return 'Rutina no encontrada'
        }

        findingWorkoutRoutine.isActive = false
        await this.workoutRuotineRepository.save(findingWorkoutRoutine) ///Guardar el cambio

        return `Rutina ${findingWorkoutRoutine.name} desactivada exitosamente`
    }

    async activateWorkoutRoutine(id:string){

        const findingWorkoutRoutine = await this.workoutRuotineRepository.findOneBy({ id })

        if(!findingWorkoutRoutine){
            return 'Rutina no encontrada'
        }

        findingWorkoutRoutine.isActive = true
        await this.workoutRuotineRepository.save(findingWorkoutRoutine)

        return `Rutina ${findingWorkoutRoutine.name} activada exitosamente`
    }

}