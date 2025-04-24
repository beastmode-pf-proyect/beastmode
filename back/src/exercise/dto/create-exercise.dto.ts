import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsBoolean,
} from 'class-validator';

export class CreateExerciseDto {
  @ApiProperty({
    description: 'Nombre del ejercicio',
    example: 'Pecho plano',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción del ejercicio',
    example: 'Descarga el pecho plano',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Url de la imagen del ejercicio',
    example: 'https://example.com/image.jpg',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive = true;

  @IsString()
  category: string;
  // Asegúrate de que este campo esté definido en tu entidad y DTO
}
