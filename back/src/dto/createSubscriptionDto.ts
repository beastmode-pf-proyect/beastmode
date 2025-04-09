import {  IsDate, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
    @ApiProperty({
        description: 'Id del usuario',
        example: '7da788a8-c2a6-4fb3-a4be-8992e142ab64'
    })
    @IsString()
    userId: string;

    @ApiProperty({
        description: 'Id de la membresia',
        example: '3eeebca9-bfbc-47eb-b8d5-c15b955dbb92'
    })
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