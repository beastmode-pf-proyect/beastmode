import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateRoutineExerciseDto {
    @ApiProperty({
                description: 'Id de la rutina',
                example: 'f4c6b666-c38f-4669-b9eb-b7dc37c89ffc'
            })
    @IsUUID()
    @IsNotEmpty()
    routineId: string;

    @ApiProperty({
                description: 'Id del ejercicio',
                example: 'f4c6b666-c38f-4669-b9eb-b7dc37c89ffc'
            })
    @IsUUID()
    @IsNotEmpty()
    exerciseId: string;

    @ApiProperty({
                description: 'N° de set',
                example: '3'
            })
    @IsNumber()
    @IsOptional()
    sets?: number = 3; // Valor por defecto

    @ApiProperty({                
                description: 'N° de reps',
                example: '10'
            })
    @IsNumber()
    @IsOptional()
    reps?: number = 10; // Valor por defecto

    @ApiProperty({
                description: 'Duración de la rutina',
                example: '25 min'
            })
    @IsNumber()
    @IsOptional()
    duration?: number;

    @ApiProperty({
                description: 'Duración del descanso',
                example: '5 min'
            })
    @IsNumber()
    @IsOptional()
    rest?: number = 30; // Valor por defecto

    @ApiProperty({
                description: 'Orden de la rutina',
                example: '1'
            })
    @IsNumber()
    @IsOptional()
    order?: number = 0; // Valor por defecto
}