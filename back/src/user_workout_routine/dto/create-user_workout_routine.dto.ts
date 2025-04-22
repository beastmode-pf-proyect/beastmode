import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateUserWorkoutDto {
    @ApiProperty({
            description: 'Id de la rutina',
            example: 'f4c6b666-c38f-4669-b9eb-b7dc37c89ffc'
        })
    @IsUUID()
    routineId: string;
}  