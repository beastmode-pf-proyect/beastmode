import { IsOptional,IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseDto } from './create-exercise.dto';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}