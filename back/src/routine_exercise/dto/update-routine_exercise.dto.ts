
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateRoutineExerciseDto {
    @ApiProperty({
                description: 'N° de set',
                example: '5'
            })
    @IsNumber()
    @IsOptional()
    sets?: number;

    @ApiProperty({
                description: 'N° de reps',
                example: '5'
            })
    @IsNumber()
    @IsOptional()
    reps?: number;

    @ApiProperty({
                description: 'Duración de la rutina',
                example: '5 min'
            })
    @IsNumber()
    @IsOptional()
    duration?: number;

    @ApiProperty({
                description: 'Duración de la rutina',
                example: '1 min'
            })
    @IsNumber()
    @IsOptional()
    rest?: number;

    @ApiProperty({
                description: 'Orden de la rutina',
                example: '1'
            })
    @IsNumber()
    @IsOptional()
    order?: number;


    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}