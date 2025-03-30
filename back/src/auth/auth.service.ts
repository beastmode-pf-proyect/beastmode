import { BadRequestException, Injectable, InternalServerErrorException, Req } from '@nestjs/common'
import { UsersRepository } from '../users/users.repository';
import { User } from 'src/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import  * as bcrypt from "bcrypt"
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';


@Injectable()
export class AuthService{
  constructor (private readonly userRepository: UsersRepository,
              private readonly jwtService: JwtService,
              @InjectRepository(User)
    private readonly userEntity: Repository<User>,
  ){}

  async SignUp(newUser: SignUpDto): Promise<Object> {
    const userDb = await this.userRepository.getUserByEmail(newUser.email);
    if (userDb) throw new BadRequestException('Email Already Used');

    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    if (!hashedPassword)
      throw new BadRequestException('Password could not be created');

    const newUserDb: Partial<User> = await this.userRepository.createUser({
      ...newUser,
      password: hashedPassword,
    });
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
      role: userDb.role,
    };

    const token = await this.jwtService.sign(userPayload);
    const { password, ...userWithOutPassword } = userDb;
    return {
      succes: 'User has been logged in succesfully',
      user: userWithOutPassword,
      token: token,
    };
  }


  ///////// google
  async googleLogin(data: any): Promise<{ createdUser: User; isNew: boolean }> {
    return runWithTryCatchBadRequest(async () => {
      const user: User = await this.userRepository.getUserByEmail(data.email);
      if (!user) {
        const name = data.firstName;
        const email = data.email;
        const newUser = {
          name: name || '',
          email: email,
          surname: data.LastName,
          password: '',
          confirmPassword: '',
          address: '',
          phone: '',
          image: data.picture,
          dni: '',
          country: '',
        };
        const createdUser: User = await this.userRepository.createUser(newUser);
        return { createdUser, isNew: true };
      } else {
        return { createdUser: user, isNew: false };
      }
    });
  }

  async createJwtToken(user: User): Promise<string> {
    const payload: any = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      imgUrl: user.imageUrl,
      role: user.role,
      isActive: user.isActive,
      subscription: user.subscription,
      workoutRoutines: user.workoutRoutines,
    };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }
}

  async function runWithTryCatchBadRequest<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
}


