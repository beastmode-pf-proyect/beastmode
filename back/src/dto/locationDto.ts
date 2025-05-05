import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class LocationDto {
    @ApiProperty({
        description: 'Nombre del lugar',
        example: 'Centro de entrenamiento'
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Dirección del lugar',
        example: 'Av. Juan XXIII, 123'
    })
    @IsString()
    address: string;

    @ApiProperty({
        description: 'longitud del lugar',
        example: '-12.123, -12.123'
    })
    @IsNumber()
    longitude: number;

    @ApiProperty({
        description: 'latitud del lugar',
        example: '-12.123, -12.123'
    })
    @IsNumber()
    latitude: number;

    @ApiProperty({
        description: 'Detalles del lugar',
        example: 'Centro de entrenamiento'
    })
    @IsString()
    details: string;
}