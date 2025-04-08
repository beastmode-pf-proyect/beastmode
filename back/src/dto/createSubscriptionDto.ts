import { IsUUID, IsDate, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
    @IsString()
    userId: string;

    @IsString()
    membershipPlanId: string;

    @ApiProperty({
        description: 'Fecha de inicio del Plan',
        example: '2025-03-31'
    })
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @ApiProperty({
        description: 'Fecha de fin del Plan',
        example: '2025-03-31'
    })
    @IsDate()
    @Type(() => Date)
    endDate: Date;

    @ApiProperty({
        description: 'Pago realizado',
        example: false
    })
    @IsBoolean()
    @IsOptional()
    isPago = false;

    @ApiProperty({
        description: 'Estado del Plan',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    isActive = true;
}