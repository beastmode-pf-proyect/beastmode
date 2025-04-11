import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { updateUserDto } from "src/dto/updateUserDto";
import { User } from "src/entities/users.entity";
import { Repository } from "typeorm";


export class UsersRepository{
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ){}

    async getUsersTrainerAndClient() : Promise <Partial<User>[]> {
      let users = await this.usersRepository.find({
        relations: ['role']
      })
      const nonAdminUsers = users.filter(user => !user.role || user.role.name !== 'admin');
      if(!nonAdminUsers){
        throw new NotFoundException('No hay usuarios Trainers o Clients')
      }
      return nonAdminUsers;
    }

    async getUsersTrainer() : Promise <Partial<User>[]> {
      let users = await this.usersRepository.find({
        relations: ['role']
      })
      const trainersUsers = users.filter(user =>  user.role.name !== 'admin' && user.role.name !== 'client');
      if(!trainersUsers){
        throw new NotFoundException('No hay usuarios Trainers')
      }
      return trainersUsers;
    }

    async getUsersClient() : Promise <Partial<User>[]> {
      let users = await this.usersRepository.find({
        relations: ['role']
      })
      const clientUsers = users.filter(user =>  user.role.name !== 'admin' && user.role.name !== 'trainer');
      if(!clientUsers){
        throw new NotFoundException('No hay usuarios Clients')
      }
      return clientUsers;
    }

  
    async getById(id : string) {
      const user = await this.usersRepository.findOne({
        where:{ auth0_id : id }
      });
    
      if(!user){
        throw new NotFoundException('Usuario no encontrado')
      }
          return user;
    }

    async getUserByIdAndRole(id : string, rol: string) {
      const user = await this.usersRepository.findOne({
        where:{ auth0_id : id, role: { name: rol } }
      });
    
      if(!user){
        throw new NotFoundException('Usuario no encontrado')
      }
          return user;
    }

    async updateUser(id : string, user: updateUserDto) {
      await this.usersRepository.update(id, user) 
      
      const updateUser = await this.usersRepository.findOneBy({
       auth0_id : id
      })
    
      const {role, ...userWithoutPassword } = updateUser
    
      return 'Usuario Actualizado'
    }

    async updatetrainerUser(id:string){
      const serchUser = await this.usersRepository.findOneBy({
       auth0_id : id
      })
  
      if(!serchUser){
          throw new BadRequestException ("Usuario Inexistente")
      }else if (serchUser.role.name === 'trainer'){
          throw new BadRequestException ("El usuario ya es un trainer")
      }
  
      serchUser.role.name = 'trainer';
  
       await this.usersRepository.save(serchUser);
    }

    async updateclientUser(id:string){
      const serchUser = await this.usersRepository.findOneBy({
       auth0_id : id
      })
  
      if(!serchUser){
          throw new BadRequestException ("Usuario Inexistente")
      }else if (serchUser.role.name === 'client'){
          throw new BadRequestException ("El usuario ya es un client")
      }
  
      serchUser.role.name = 'client';
  
       await this.usersRepository.save(serchUser);
       return 'Usuario actualizado con exito a rol cliente'
    }

    async deleteUser (id: string){
      const user = await this.usersRepository.findOneBy({
       auth0_id : id
      })

    if(!user){
        throw new NotFoundException('Usuario no encontrado')
    }

    this.usersRepository.remove(user)

    return 'Usuario eliminado con exito'
    }

    async desactivateUser(id:string){

      const findingUser = await this.usersRepository.findOneBy({
       auth0_id : id
      })

      if(!findingUser){
          return 'Usuario no encontrada'
      }

      findingUser.is_blocked = true

      return `Usuario ${findingUser.name} desactivado exitosamente`
  }

  async activateUser(id:string){

      const findingUser = await this.usersRepository.findOneBy({
       auth0_id : id
      })

      if(!findingUser){
          return 'Usuario no encontrada'
      }

      findingUser.is_blocked = false

      return `Usuario ${findingUser.name} activado exitosamente`
  }

///////////////////////////  AUTH

async getUserByEmail(email: string): Promise <Partial<User>> {
  const user = await this.usersRepository.findOne({
    where: { email },
  });
  return user;
}  


}