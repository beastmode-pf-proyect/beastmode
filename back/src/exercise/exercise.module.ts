import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { ExerciseRepository } from './exercise.repository';
import { Exercise } from '../entities/exercise.entity';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise]),
FileUploadModule], // Asegúrate de importar el módulo de carga de archivos si lo necesitas
  controllers: [ExerciseController],
  providers: [
    ExerciseService,
    ExerciseRepository,
  ],
  exports: [ExerciseService], // Si necesitas usar el servicio en otros módulos
})
export class ExerciseModule {}