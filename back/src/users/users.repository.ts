import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { updateUserDto } from "src/dto/updateUserDto";
import { User } from "src/entities/users.entity";
import { Repository } from "typeorm";


export class UsersRepository{
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ){}

    async getUsers() : Promise <Partial<User>[]> {
      let users = await this.usersRepository.find()
  
      const userWithoutPassword = users.map(({ ...user}) => user)
  
      return userWithoutPassword
    }

  
    async getById(id : string) {
      const user = await this.usersRepository.findOne({
        where:{ auth0_id : id }
      });
    
      if(!user){
        throw new NotFoundException('Usuario no encontrado')
      }
      
          const { role, ...userWithoutPassword} = user
          return userWithoutPassword;
    }

    async updateUser(id : string, user: updateUserDto) {
      await this.usersRepository.update(id, user) 
      
      const updateUser = await this.usersRepository.findOneBy({ id })
    
      const {role, ...userWithoutPassword } = updateUser
    
      return 'Usuario Actualizado'
    }

    async updatetrainerUser(id:string){
      const serchUser = await this.usersRepository.findOneBy({ id })
  
      if(!serchUser){
          throw new BadRequestException ("Usuario Inexistente")
      }
  
      serchUser.role.name = 'trainer';
  
       await this.usersRepository.save(serchUser);
    }

    async deleteUser (id: string){
      const user = await this.usersRepository.findOneBy({ id })

    if(!user){
        throw new NotFoundException('Usuario no encontrado')
    }

    this.usersRepository.remove(user)

    return 'Usuario eliminado con exito'
    }

    async desactivateUser(id:string){

      const findingUser = await this.usersRepository.findOneBy({ id })

      if(!findingUser){
          return 'Usuario no encontrada'
      }

      findingUser.is_blocked = true

      return `Usuario ${findingUser.name} desactivado exitosamente`
  }

  async activateUser(id:string){

      const findingUser = await this.usersRepository.findOneBy({ id })

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