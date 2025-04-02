import { IsUUID, IsDate, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubscriptionDto {
    @IsUUID()
    userId: string;

    @IsUUID()
    membershipPlanId: string;

    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @IsDate()
    @Type(() => Date)
    endDate: Date;

    @IsBoolean()
    @IsOptional()
    isPago = false;

    @IsBoolean()
    @IsOptional()
    isActive = true;
}