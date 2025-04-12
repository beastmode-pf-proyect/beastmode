import { Injectable } from '@nestjs/common';
import { WorkoutRoutineRepository } from './workout-routine.repository';
import { WorkoutRoutine } from 'src/entities/workout.routine.entity';
import { updateWorkoutRoutineDto } from 'src/dto/updateWorkoutRoutineDto';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Injectable()
export class WorkoutRoutineService {
constructor(private workoutRuotineRepository: WorkoutRoutineRepository,
            private fileUploadService: FileUploadService,
){}

getWorkoutRoutines(){
    return this.workoutRuotineRepository.getWorkoutRoutines()
}

getWorkoutRoutineById(id: string){
    return this.workoutRuotineRepository.getWorkoutRoutineById(id)
}

updateWorkoutRoutine(id: string, updateWorkoutRoutine: updateWorkoutRoutineDto){
    return this.workoutRuotineRepository.updateWorkoutRoutine(id, updateWorkoutRoutine)
}

async createWorkoutRoutine(workoutRoutine: Partial<WorkoutRoutine>, file?: Express.Multer.File) {
    if (file) {
        const uploadedImage = await this.fileUploadService.uploadImage(file);
        workoutRoutine.imageUrl = uploadedImage.secure_url;
    }
    
    const createdWorkoutRoutine = await this.workoutRuotineRepository.createWorkoutRoutine(workoutRoutine);

    if (!createdWorkoutRoutine) {
        throw new Error('No se pudo crear la rutina');
    }

    return `Rutina ${createdWorkoutRoutine.name} creada exitosamente`;
}

desactivateWorkoutRoutine(id: string){
    return this.workoutRuotineRepository.desactivateWorkoutRoutine(id)
}

activateWorkoutRoutine(id: string){
    return this.workoutRuotineRepository.activateWorkoutRoutine(id)
}

async routineExists(id: string): Promise<boolean> {
    try {
            const routine = await this.workoutRuotineRepository.getWorkoutRoutineById(id);
            return !!routine;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return false;
    }
    }

}
