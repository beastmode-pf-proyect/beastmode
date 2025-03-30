import { Body, Controller, Get, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { UserLowerCaseInterceptor } from 'src/interceptors/user-data-lower-case.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { validateUserInteceptor } from 'src/interceptors/validateUser.interceptor';
import { Request } from 'express-jwt';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userRepository: UsersRepository) {}

    @Post('signup')
    @UseInterceptors(UserLowerCaseInterceptor, validateUserInteceptor)
    async signUp(@Body() newUser: SignUpDto) {
      return await this.authService.SignUp(newUser);
    }
  
    @Post('signin')
    @UseInterceptors(UserLowerCaseInterceptor)
    async signIn(@Body() credentialsUser: SignInDto) {
      return await this.authService.SignIn(credentialsUser);
    }

  }
    // @Get('profile')
    // getProtected(@Req() req:Request) {
    //   console.log(req.body)
    //   return JSON.stringify(req.oidc.user)
    // }
    
    // @Get('googleLogin')
    // @UseGuards(AuthGuard('google'))
    // async googleAuth(@Req() req: Request, @Res() res: Response): Promise<void> {}

    // @Get('google/callback')
    // @UseGuards(AuthGuard('google'))
    // async googleAuthRedirect(@Req() req, @Res() res: Response): Promise<void> {
    // const { createdUser } = await this.authService.googleLogin(req.user);
    // const user = await this.userRepository.getUserByEmail(createdUser.email);
    // const jwt = await this.authService.createJwtToken(user);
    // const URL_FRONT = process.env.FRONT_URL;
    // let redirectUrl: string = URL_FRONT + '/completa-tu-informacion';
    // if (
    //   user.name &&
    //   user.surname &&
    //   user.address &&
    //   user.country &&
    //   user.dni &&
    //   user.phone
    // )
    //   redirectUrl = URL_FRONT;

    // console.log('En auth controller jwt: ', jwt);
    // console.log('redirectUrl: ', redirectUrl);
    // res.redirect(redirectUrl + `?auth_token=${jwt}`);
    
    // @Get('/callback')
    // async Auth0Callback(@Req() req: Request) {
    //   console.log(req.headers)
    // }

