import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "src/dto/createUserDto";

export class SignInDto extends PickType(CreateUserDto,[
    'email','password'
]){

}