import { IsUUID, IsDate, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubscriptionDto {
    @IsUUID()
    @IsOptional()
    userId?: string;

    @IsUUID()
    @IsOptional()
    membershipPlanId?: string;

    @ApiProperty({
        description: 'Fecha de inicio del Plan',
        example: '2025-03-31'
    })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    startDate?: Date;

    @ApiProperty({
        description: 'Fecha de fin del Plan',
        example: '2025-03-31'
    })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    endDate?: Date;

    @ApiProperty({
        description: 'Pago realizado',
        example: false
    })
    @IsBoolean()
    @IsOptional()
    isPago?: boolean;

    @ApiProperty({
        description: 'Estado del Plan',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}