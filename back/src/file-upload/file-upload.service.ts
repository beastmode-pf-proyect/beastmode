import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadRepository } from './file-upload.repository';
import { Repository } from 'typeorm';
import { User } from 'src/entities/users.entity';
import { Exercise } from 'src/entities/exercise.entity';
import { WorkoutRoutine } from 'src/entities/workout.routine.entity';
import { UploadApiResponse } from 'cloudinary';


@Injectable()
export class FileUploadService {
    constructor(
        private readonly fileUploadRepository: FileUploadRepository,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Exercise)
        private readonly exerciseRepository: Repository<Exercise>,
        @InjectRepository(WorkoutRoutine)
        private readonly WorkoutRoutineRepository: Repository<WorkoutRoutine>,

    ) {}

    async uploadUserImage(file: Express.Multer.File) {
        
        const uploadedImage = await this.fileUploadRepository.uploadImage(file);

        return uploadedImage;
    }



    async uploadExerciseImage(file: Express.Multer.File, exerciseId: string) {
        
        const exerciseExists = await this.exerciseRepository.findOneBy({ id: exerciseId });
        if (!exerciseExists) {
            return 'El ejercicio no existe!';
        }

        // Sube la imagen a Cloudinary y obtiene la URL segura
        const uploadedImage = await this.fileUploadRepository.uploadImage(file);

        // Actualiza la URL de la imagen en la base de datos
        await this.exerciseRepository.update(exerciseId, { imageUrl: uploadedImage.secure_url });

        // Retorna el user actualizado
        return await this.exerciseRepository.findOneBy({ id: exerciseId });
    }

    async uploadWorkoutImage(file: Express.Multer.File, workoutId: string) {
        const workoutExists = await this.WorkoutRoutineRepository.findOneBy({id:workoutId});
        if(!workoutExists) {
            return 'La rutina no existe!';
        }
        // Sube la imagen a Cloudinary y obtiene la URL segura

        const  uploadedImage = await this.fileUploadRepository.uploadImage(file);
        // Actualiza la URL de la imagen en la base de datos
        await this.WorkoutRoutineRepository.update(workoutId, { imageUrl: uploadedImage.secure_url });
        
        // Retorna el WorkoutRoutine actualizado
        return await this.WorkoutRoutineRepository.findOneBy({ id: workoutId });
    }

    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
        return this.fileUploadRepository.uploadImage(file);
    }

}