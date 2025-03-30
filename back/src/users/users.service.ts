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

    ///// AUTH

    async getUserProfile(auth0Id: string): Promise<User> {
        const user = await this.usersRepository.findByAuth0Id(auth0Id);
        
        if (!user) {
          throw new NotFoundException('Perfil de usuario no encontrado');
        }
    
        return user;
      }
    
}
