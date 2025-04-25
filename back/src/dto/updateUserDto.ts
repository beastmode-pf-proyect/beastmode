import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";


export class updateUserDto {
    @ApiProperty({
        description: 'Nombre del Usuario',
        example: 'Example'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3,20)
    name: string
}