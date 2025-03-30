import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./createUserDto";


export class updateUserDto extends PickType(CreateUserDto,
    [   
        'name',
        'surname',
        'dni',
        'email',
        'address',
        'country',
        'phone',
        'password',
        'confirmPassword'
    ]
){}