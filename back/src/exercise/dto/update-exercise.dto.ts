import { IsOptional,IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseDto } from './create-exercise.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {
    @ApiProperty({
                description: 'IsActive',
                example: '"isActive": true'
            })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}