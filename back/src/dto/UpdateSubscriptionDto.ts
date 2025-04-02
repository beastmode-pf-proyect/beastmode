import { IsUUID, IsDate, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSubscriptionDto {
    @IsUUID()
    @IsOptional()
    userId?: string;

    @IsUUID()
    @IsOptional()
    membershipPlanId?: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    startDate?: Date;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    endDate?: Date;

    @IsBoolean()
    @IsOptional()
    isPago?: boolean;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}