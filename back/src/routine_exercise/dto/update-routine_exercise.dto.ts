
import { IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateRoutineExerciseDto {
    @IsNumber()
    @IsOptional()
    sets?: number;

    @IsNumber()
    @IsOptional()
    reps?: number;

    @IsNumber()
    @IsOptional()
    duration?: number;

    @IsNumber()
    @IsOptional()
    rest?: number;

    @IsNumber()
    @IsOptional()
    order?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}