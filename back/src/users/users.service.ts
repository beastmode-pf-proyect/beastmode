import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { UsersRepository } from './users.repository';
import { updateUserDto } from 'src/dto/updateUserDto';

@Injectable()
export class UsersService {
    constructor (private readonly usersRepository : UsersRepository){}

    getUsers() { 
        return this.usersRepository.getUsers();
    }

    getUserById(id: string){
        return this.usersRepository.getById(id)
    }

    updateUser(id: string, user: updateUserDto) {                                  
        return this.usersRepository.updateUser(id, user);
    }

    updatetrainerUser(id: string){
        return this.usersRepository.updatetrainerUser(id)
    }

    deleteUser(id:string){
        return this.usersRepository.deleteUser(id)
    }

    desactivateUser(id:string){
        return this.usersRepository.desactivateUser(id)
    }

    activateUser(id:string){
        return this.usersRepository.activateUser(id)
    }

}
