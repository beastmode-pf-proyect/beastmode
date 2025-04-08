import { IsUUID, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateRoutineExerciseDto {
    @IsUUID()
    @IsNotEmpty()
    routineId: string;

    @IsUUID()
    @IsNotEmpty()
    exerciseId: string;

    @IsNumber()
    @IsOptional()
    sets?: number = 3; // Valor por defecto

    @IsNumber()
    @IsOptional()
    reps?: number = 10; // Valor por defecto

    @IsNumber()
    @IsOptional()
    duration?: number;

    @IsNumber()
    @IsOptional()
    rest?: number = 30; // Valor por defecto

    @IsNumber()
    @IsOptional()
    order?: number = 0; // Valor por defecto
}