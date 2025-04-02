import { Body, Controller, Get, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { SignInDto } from './dto/signIn.dto';
import { UserLowerCaseInterceptor } from 'src/interceptors/user-data-lower-case.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { validateUserInteceptor } from 'src/interceptors/validateUser.interceptor';
import { Response } from 'express';
import { Request } from 'express-jwt';
import { CreateUserDto } from 'src/dto/createUserDto';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userRepository: UsersRepository) {}

    @Post('signup')
    @UseInterceptors(UserLowerCaseInterceptor, validateUserInteceptor)
    async signUp(@Body() newUser: CreateUserDto) {
      return await this.authService.SignUp(newUser);
    }
  
    @Post('signin')
    @UseInterceptors(UserLowerCaseInterceptor)
    async signIn(@Body() credentialsUser: SignInDto) {
      return await this.authService.SignIn(credentialsUser);
    }
      

    @Get('googleLogin')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request, @Res() res: Response): Promise<void> {}
    
    
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res: Response): Promise<void> {
      const { createdUser } = await this.authService.googleLogin(req.user);
      const user = await this.userRepository.getUserByEmail(createdUser.email);
      const jwt = await this.authService.createJwtToken(user);
      const URL_FRONT = process.env.FRONT_URL;
      let redirectUrl: string = URL_FRONT + '/completa-tu-informacion';
        if (
          user.name &&
          user.email &&
          user.imageUrl &&
          user.role
        )
      redirectUrl = URL_FRONT;
        
      console.log('En auth controller jwt: ', jwt);
      console.log('redirectUrl: ', redirectUrl);
      res.redirect(redirectUrl + `?auth_token=${jwt}`);
        
       
          
        }
      }
