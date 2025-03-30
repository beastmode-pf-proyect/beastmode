import { InjectRepository } from "@nestjs/typeorm";
import { updateMembershipDto } from "src/dto/updateMembershipDto";
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
            return 'Membresia Inexistente'
        }

        return membership
    }

    async updateWorkoutRoutine(id: string, updateWorkoutRoutine: updateWorkoutRoutineDto) {

        await this.workoutRuotineRepository.update( id, updateWorkoutRoutine)

        const updatedWorkoutRoutine = await this.workoutRuotineRepository.findOneBy({ id })

        return `Rutinas de ejercicios actualizada: ${updatedWorkoutRoutine}`

    }

    async createWorkoutRoutine(workoutRoutine: Partial<WorkoutRoutine>){

        const createdWorkoutRoutine = await this.workoutRuotineRepository.create(workoutRoutine)

        return `Rutina ${createdWorkoutRoutine.name} creada exitosamente `

    }

    async desactivateWorkoutRoutine(id:string){

        const findingWorkoutRoutine = await this.workoutRuotineRepository.findOneBy({ id })

        if(!findingWorkoutRoutine){
            return 'Rutina no encontrada'
        }

        findingWorkoutRoutine.isActive = false

        return `Rutina ${findingWorkoutRoutine.name} desactivada exitosamente`
    }

    async activateWorkoutRoutine(id:string){

        const findingWorkoutRoutine = await this.workoutRuotineRepository.findOneBy({ id })

        if(!findingWorkoutRoutine){
            return 'Rutina no encontrada'
        }

        findingWorkoutRoutine.isActive = true

        return `Rutina ${findingWorkoutRoutine.name} activada exitosamente`
    }

}