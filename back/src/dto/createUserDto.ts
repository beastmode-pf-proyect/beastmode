import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";


export class CreateUserDto {
    @ApiProperty({
        description: 'Nombre de Usuario con un minimo de 3 caracteres y maximo de 80 caracteres',
        example: 'Example'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3,80)
    name: string

    @ApiProperty({
        description: 'Apellido del Usuario con un minimo de 3 caracteres y maximo de 80 caracteres',
        example: 'Example2'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3,80)
    surname: string

    @ApiProperty({
        description: 'DNI del Usuario con un minimo de 3 caracteres y maximo de 10 caracteres',
        example: '26512563'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3,10)
    dni: string

    @ApiProperty({
       description: 'Email del Usuario',
       example: 'Example@gmail.com'
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @ApiProperty({
        description: 'Direccion de Usuario con un minimo de 3 caracteres y maximo de 80 caracteres',
        example: 'Calle de la República 1'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3,80)
    address: string

    @ApiProperty({
        description: 'Imagen del Usuario',
        example: 'https://example.com/image.png'
    })
    @IsNotEmpty()
    @IsString()
    imageUrl: string

    @ApiProperty({
        description: 'País del Usuario',
        example: 'Argentina'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3,80)
    country: string

    @ApiProperty({
        description: 'Teléfono del Usuario con un minimo de 3 caracteres y maximo de 10 caracteres',
        example: '123456789'
    })
    @IsOptional()
    @IsString()
    phone: string;

    @ApiProperty({
        description: 'Contraseña del Usuario con un minimo de 8 caracteres y maximo de 15 caracteres',
        example: 'Lavida#EsBell@2'
    })
    @IsNotEmpty()
    @IsString()
    @Length(8,15)
    @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)
    password: string

    @ApiProperty({
        description: 'Confirmar Contraseña del Usuario con un minimo de 8 caracteres y maximo de 15 caracteres',
        example: 'Lavida#EsBell@2'
    })
    @IsNotEmpty()
    @IsString()
    @Length(8,15)
    @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)
    confirmPassword: string

    @IsEmpty()
    isUser?: string;

}