import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { FileUploadRepository } from './file-upload.repository';
import { CloudinaryConfig } from '../config/cloudinary';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { WorkoutRoutine } from 'src/entities/workout.routine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,WorkoutRoutine])],
  controllers: [FileUploadController],
  providers: [FileUploadService,FileUploadRepository,CloudinaryConfig],
  exports: [CloudinaryConfig]
})

export class FileUploadModule {}