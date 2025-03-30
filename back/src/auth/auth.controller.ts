import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { UserLowerCaseInterceptor } from 'src/interceptors/user-data-lower-case';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userRepository: UsersRepository) {}

    @Post('signup')
    @UseInterceptors(UserLowerCaseInterceptor)
    async signUp(@Body() newUser: SignUpDto) {
      return await this.authService.SignUp(newUser);
    }
  
    @Post('signin')
    @UseInterceptors(UserLowerCaseInterceptor)
    async signIn(@Body() credentialsUser: SignInDto) {
      return await this.authService.SignIn(credentialsUser);
    }
}
