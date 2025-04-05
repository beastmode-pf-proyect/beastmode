import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadRepository } from './file-upload.repository';
import { Repository } from 'typeorm';
import { User } from 'src/entities/users.entity';
import { Exercise } from 'src/entities/exercise.entity';

@Injectable()
export class FileUploadService {
    constructor(
        private readonly fileUploadRepository: FileUploadRepository,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Exercise)
        private readonly exerciseRepository: Repository<Exercise>
    ) {}

    async uploadUserImage(file: Express.Multer.File, userId: string) {
        
        const userExists = await this.usersRepository.findOneBy({ id: userId });
        if (!userExists) {
            return 'El usuario no existe!';
        }

        // Sube la imagen a Cloudinary y obtiene la URL segura
        const uploadedImage = await this.fileUploadRepository.uploadImage(file);

        // Actualiza la URL de la imagen en la base de datos
        await this.usersRepository.update(userId, { imageUrl: uploadedImage.secure_url });

        // Retorna el user actualizado
        return await this.usersRepository.findOneBy({ id: userId });
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
}