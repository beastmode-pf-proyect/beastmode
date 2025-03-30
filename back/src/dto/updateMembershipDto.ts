import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";


export class updateMembershipDto{
    
    @IsNotEmpty()
    @IsString()
    @Length(3,80)
    name: string;
    
    @IsNotEmpty()
    @IsNumber()
    @Length(1,7)
    price: number;
    
    @IsNotEmpty()
    @IsString()
    @Length(3,80)
    duration: string;

    @IsNotEmpty()
    @IsString()
    @Length(3,200)
    benefits: string;

}