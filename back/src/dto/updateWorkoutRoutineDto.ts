import { IsNotEmpty, IsString, Length } from "class-validator";


export class updateWorkoutRoutineDto{

@IsNotEmpty()
@IsString()
@Length(3,80)
name: string;
    
@IsNotEmpty()
@IsString()
@Length(3,500)
description: string;
    
@IsNotEmpty()
@IsString()
@Length(3,200)    
imageUrl: string;
}