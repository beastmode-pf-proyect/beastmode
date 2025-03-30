// import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";


export class CreateUserDto {
    // @ApiProperty({
    //     description: 'Nombre de Usuario con un minimo de 3 caracteres y maximo de 80 caracteres',
    //     example: 'Example'
    // })
    @IsNotEmpty()
    @IsString()
    @Length(3,80)
    name: string

    @IsNotEmpty()
    @IsString()
    @Length(3,80)
    surname: string

    @IsNotEmpty()
    @IsString()
    @Length(3,10)
    dni: string

    // @ApiProperty({
    //     description: 'Email del Usuario',
    //     example: 'Example@gmail.com'
    // })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @Length(3,80)
    address: string

    @IsNotEmpty()
    @IsString()
    @Length(3,80)
    country: string

    @IsOptional()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    @Length(8,15)
    @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)
    password: string

    @IsNotEmpty()
    @IsString()
    @Length(8,15)
    @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)
    confirmPassword: string

    @IsEmpty()
    isUser?: string;

}