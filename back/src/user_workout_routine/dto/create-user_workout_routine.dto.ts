import { IsUUID } from "class-validator";

export class CreateUserWorkoutDto {
    @IsUUID()
    userId: string;

    @IsUUID()
    routineId: string;
}  