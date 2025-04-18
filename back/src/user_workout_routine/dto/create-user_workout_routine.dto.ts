import { IsString, IsUUID } from "class-validator";

export class CreateUserWorkoutDto {
    
    @IsUUID()
    routineId: string;
}  