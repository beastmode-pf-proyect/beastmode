import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from 'src/users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([User]), PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository, JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
