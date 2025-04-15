import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { UsersRepository } from './users.repository';
import { updateUserDto } from 'src/dto/updateUserDto';

@Injectable()
export class UsersService {
    constructor (private readonly usersRepository : UsersRepository){}

    getUsersTrainerAndClient() { 
        return this.usersRepository.getUsersTrainerAndClient();
    }

    getUsersTrainer(){
        return this.usersRepository.getUsersTrainer();
    }

    getUsersClient(){
        return this.usersRepository.getUsersClient();
    }

    getUserById(id: string){
        return this.usersRepository.getById(id)
    }

    getRoleById(id: string){
        return this.usersRepository.getRoleById(id)
    }

    async getSubscriptionsByUserId(id: string) {
        return this.usersRepository.getSubscriptions(id);
    }

    getUserByIdAndRole(id: string, role: string){
        return this.usersRepository.getUserByIdAndRole(id, role)
    }

    updateUser(id: string, user: updateUserDto) {                                  
        return this.usersRepository.updateUser(id, user);
    }

    updatetrainerUser(id: string){
        return this.usersRepository.updatetrainerUser(id)
    }

    updateclientUser(id: string){
        return this.usersRepository.updateclientUser(id)
    }

    async userExists(id: string): Promise<boolean> {
        try {
            const user = await this.usersRepository.getById(id);
            return !!user;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return false;
        }
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
