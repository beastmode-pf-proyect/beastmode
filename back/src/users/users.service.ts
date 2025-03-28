import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor (private readonly usersRepository : UsersRepository){}

    getUsers() { 
        return this.usersRepository.getUsers();
    }
}
