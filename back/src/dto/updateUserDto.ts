import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./createUserDto";


export class updateUserDto extends PickType(CreateUserDto,
    [   
        'email',
        'password',
        'confirmPassword'
    ]
){}