import { Injectable } from '@nestjs/common';
import { WorkoutRoutineRepository } from './workout-routine.repository';
import { WorkoutRoutine } from 'src/entities/workout.routine.entity';
import { updateWorkoutRoutineDto } from 'src/dto/updateWorkoutRoutineDto';

@Injectable()
export class WorkoutRoutineService {
constructor(private workoutRuotineRepository: WorkoutRoutineRepository){}

getWorkoutRoutines(){
    return this.workoutRuotineRepository.getWorkoutRoutines()
}

getWorkoutRoutineById(id: string){
    return this.workoutRuotineRepository.getWorkoutRoutineById(id)
}

updateWorkoutRoutine(id: string, updateWorkoutRoutine: updateWorkoutRoutineDto){
    return this.workoutRuotineRepository.updateWorkoutRoutine(id, updateWorkoutRoutine)
}

createWorkoutRoutine(WorkoutRoutine: Partial<WorkoutRoutine>){
    return this.workoutRuotineRepository.createWorkoutRoutine(WorkoutRoutine)
}

desactivateWorkoutRoutine(id: string){
    return this.workoutRuotineRepository.desactivateWorkoutRoutine(id)
}

activateWorkoutRoutine(id: string){
    return this.workoutRuotineRepository.activateWorkoutRoutine(id)
}

}
