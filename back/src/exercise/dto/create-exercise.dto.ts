import { IsString, IsNotEmpty, IsOptional, IsUrl, IsBoolean } from 'class-validator';

export class CreateExerciseDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsUrl()
    @IsOptional()
    imageUrl?: string;

    @IsBoolean()
    @IsOptional()
    isActive = true;
}