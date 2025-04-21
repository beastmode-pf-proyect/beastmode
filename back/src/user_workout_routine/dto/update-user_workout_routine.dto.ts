import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateUserWorkoutDto {
    @ApiProperty({
            description: 'isActive',
            example: '"isActive": true'
        })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
