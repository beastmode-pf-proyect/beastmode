import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { updateUserDto } from "src/dto/updateUserDto";
import { User } from "src/entities/users.entity";
import { RolesService } from "src/roles/roles.service";
import { Repository } from "typeorm";


export class UsersRepository{
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private readonly roleService: RolesService,
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

    async getRoleByUserId(id : string) {
      const user = await this.usersRepository.findOne({
        where:{ auth0_id : id },
        relations: ['role']
      });
    
      if(!user){
        throw new NotFoundException('Usuario no encontrado')
      }

          return user.role.name;
    }

    async getSubscriptions ( id: string ) {
      const user = await this.usersRepository.findOne({
        where: { auth0_id : id},
        relations: ['subscription.membershipPlan']
      })

      if(!user){
        throw new NotFoundException('Usuario no encontrado')
      }

      if (user.subscription.length === 0) {
         throw new BadRequestException ('El usuario no posee suscripciones')
        }

      const membershipNames = user.subscription.map(sub => sub.membershipPlan ? sub.membershipPlan.name : 'Nombre no encontrado')

      return membershipNames
    
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

    async updateRoleUser(id:string, role: string){
      const serchUser = await this.usersRepository.findOne({
      where: { auth0_id : id },  
      relations: ['role']
      })
  
      if(!serchUser){
          throw new NotFoundException ("Usuario Inexistente")
      }

      const rolId = await this.roleService.getRoleByName(role)

      serchUser.role.id = rolId.id
  
       await this.usersRepository.save(serchUser);

       return 'Rol del usuario actualizado con exito'
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

      if(findingUser.is_blocked === true){
          return 'El usuario ya esta desactivado'
      }

      findingUser.is_blocked = true
      await this.usersRepository.save(findingUser)

      return `Usuario ${findingUser.name} desactivado exitosamente`
  }

  async activateUser(id:string){

      const findingUser = await this.usersRepository.findOneBy({
       auth0_id : id
      })

      if(!findingUser){
          return 'Usuario no encontrada'
      }

      if(findingUser.is_blocked === false){
          return 'El usuario ya esta activado'
      }

      findingUser.is_blocked = false
      await this.usersRepository.save(findingUser)

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