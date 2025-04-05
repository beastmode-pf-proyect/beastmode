import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { FileUploadRepository } from './file-upload.repository';
import { CloudinaryConfig } from '../config/cloudinary';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Exercise } from 'src/entities/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Exercise])],
  controllers: [FileUploadController],
  providers: [FileUploadService,FileUploadRepository,CloudinaryConfig],
  exports: [CloudinaryConfig]
})

export class FileUploadModule {}