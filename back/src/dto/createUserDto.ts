import { ApiProperty } from "@nestjs/swagger";
import { IsEmail,  IsNotEmpty,  IsString, Length, Matches } from "class-validator";


export class CreateUserDto {
    @ApiProperty({
       description: 'Email del Usuario',
       example: 'Example@gmail.com'
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string


    @ApiProperty({
        description: 'Contraseña del Usuario con un minimo de 8 caracteres y maximo de 15 caracteres',
        example: 'Lavida#EsBell@2'
    })
    @IsNotEmpty()
    @IsString()
    @Length(8,20)
    @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)
    password: string

    @ApiProperty({
        description: 'Confirmar Contraseña del Usuario con un minimo de 8 caracteres y maximo de 15 caracteres',
        example: 'Lavida#EsBell@2'
    })
    @IsNotEmpty()
    @IsString()
    @Length(8,20)
    @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)
    confirmPassword: string

}