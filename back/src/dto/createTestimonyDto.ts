import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class createTestimonyDto {

    @ApiProperty({
        description: 'Nombre completo del usuario',
        example: 'Juan Perez'
    })
    @IsString()
    fullName: string;

    @ApiProperty({
        description: 'Edad del usuario',
        example: '25'
    })
    @IsNumber()
    age: number;

    @ApiProperty({
        description: 'Ocupación del usuario',
        example: 'Ingeniero'
    })
    @IsString()
    occupation: string;

    @ApiProperty({
        description: 'Contenido del testimonio',
        example: 'Testimonio de Juan Perez'
    })
    @IsString()
    content: string;

    @ApiProperty({
        description: 'Puntuación del testimonio',
        example: '4.5'
    })
    @IsNumber()
    score: number;

    isApproved: boolean;

    isActive: boolean;

}