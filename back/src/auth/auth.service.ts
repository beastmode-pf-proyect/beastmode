import { BadRequestException, Injectable, InternalServerErrorException, Req } from '@nestjs/common'
import { UsersRepository } from '../users/users.repository';
import { User } from 'src/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import  * as bcrypt from "bcrypt"
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signIn.dto';
import { CreateUserDto } from 'src/dto/createUserDto';
import { Roles } from 'src/roles.enum';



@Injectable()
export class AuthService{
  constructor (private readonly userRepository: UsersRepository,
              private readonly jwtService: JwtService,
              @InjectRepository(User)
    private readonly userEntity: Repository<User>,
  ){}

  async SignUp(newUser: CreateUserDto): Promise<Object> {
    const userDb = await this.userRepository.getUserByEmail(newUser.email);
    if (userDb) throw new BadRequestException('Email Already in Use');

    if(newUser.password !== newUser.confirmPassword){
      throw new BadRequestException ("passwords don't match")
  }
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    if (!hashedPassword)
      throw new BadRequestException('Password could not be created');

    await this.userRepository.createUser(newUser);
    
    return {
      succes: 'User registered succesfully!',
    };
  }


  async SignIn(userCredentials: SignInDto): Promise<Object> {
    const userDb = await this.userEntity.findOne({
      where: { email: userCredentials.email },
      select: ['id', 'email', 'password', 'role'],
    });

    if (!userDb) throw new BadRequestException('Email or Password Incorrect');

    const isPasswordValid = await bcrypt.compare(
      userCredentials.password,
      userDb.password,
    );
    if (!isPasswordValid)
      throw new BadRequestException('Email or Password Incorrect');

    const userPayload = {
      id: userDb.id,
      email: userDb.email,
      roles: [ userDb.role ],
    };

    const token = await this.jwtService.sign(userPayload);
    const { password, ...userWithOutPassword } = userDb;
    return {
      succes: 'User has been logged in succesfully',
      user: userWithOutPassword,
      token: token,
    };
  }

}


