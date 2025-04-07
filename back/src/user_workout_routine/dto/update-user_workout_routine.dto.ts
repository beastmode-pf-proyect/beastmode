import { IsBoolean, IsOptional } from "class-validator";

export class UpdateUserWorkoutDto {
    
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
