import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";


export class updateMembershipDto{
    @ApiProperty({
        description: 'Nombre del Plan con un minimo de 3 caracteres y maximo de 80 caracteres',
        example: 'Example'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3,80)
    name: string;
    
    @ApiProperty({
        description: 'Precio del Plan con un minimo de 1 y maximo de 7 caracteres',
        example: 250
    })
    @IsNotEmpty()
    @IsNumber()
    @Length(1,7)
    price: number;
    
    @ApiProperty({
        description: 'Duración del Plan con un minimo de 3 caracteres y maximo de 200 caracteres',
        example: '1 año'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3,80)
    duration: string;

    @ApiProperty({
        description: 'Beneficios del Plan con un minimo de 3 caracteres y maximo de 200 caracteres',
        example: 'PRO: Todo en Novato, más: 25% OFF en suplementos deportivos, Entrenador personal 24/7 – Soporte constante, Evaluación médica completa, Acceso prioritario a todas las clases'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3,200)
    benefits: string;

}