import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";


export class updateUserDto {
    @ApiProperty({
        description: 'Nombre del Usuario',
        example: 'Example'
    })
    @IsNotEmpty()
    @IsString()
    @Length(8,20)
    name: string

    @ApiProperty({
        description: 'Url de la Imagen del Usuario',
        example: 'https://example.com/image.jpg'
    })
    @IsNotEmpty()
    @IsString()
    @Length(8,2000)
    picture: string
}