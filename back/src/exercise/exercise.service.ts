import { Injectable, NotFoundException } from '@nestjs/common';
import { ExerciseRepository } from './exercise.repository';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from '../entities/exercise.entity';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Injectable()
export class ExerciseService {
  constructor(private readonly exerciseRepository: ExerciseRepository,
              private readonly fileUploadService: FileUploadService, 
  ) {}

  async create(createExerciseDto: CreateExerciseDto, file?: Express.Multer.File): Promise<Exercise> {
    let imageUrl = createExerciseDto.imageUrl;
    
    if (file) {
      const uploadedImage = await this.fileUploadService.uploadImage(file);
      imageUrl = uploadedImage.secure_url;
    }

    return this.exerciseRepository.createExercise({
      ...createExerciseDto,
      imageUrl
    });
  }

  async findAll(): Promise<Exercise[]> {
    return this.exerciseRepository.findAllExercises();
  }

  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findExerciseById(id);
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return exercise;
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
    await this.findOne(id); // Verifica si existe
    return this.exerciseRepository.updateExercise(id, updateExerciseDto);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.exerciseRepository.exists(id);
    if (!exists) {
      throw new NotFoundException('Exercise not found');
    }
    await this.exerciseRepository.delete(id);
  }
}