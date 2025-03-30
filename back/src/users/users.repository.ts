import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dto/createUserDto";
import { updateUserDto } from "src/dto/updateUserDto";
import { User } from "src/entities/users.entity";
import { Repository } from "typeorm";
import * as bcrypt  from "bcrypt"


export class UsersRepository{
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ){}

    async getUsers() : Promise <Partial<User>[]> {
      let users = await this.usersRepository.find()
  
      const userWithoutPassword = users.map(({password, ...user}) => user)
  
      return userWithoutPassword
    }

  
    async getById(id : string) {
      const user = await this.usersRepository.findOne({
        where:{ id }
      });
    
      if(!user){
        throw new NotFoundException('Usuario no encontrado')
      }
      
          const { password, role, ...userWithoutPassword} = user
          return userWithoutPassword;
    }

    async updateUser(id : string, user: updateUserDto) {
      const newPassword = await bcrypt.hash(user.password, 10);

      if (!newPassword) throw new BadRequestException('Error in create password');

      user.password = newPassword;

      await this.usersRepository.update(id, user) 
      
      const updateUser = await this.usersRepository.findOneBy({ id })
    
      const {password, role, ...userWithoutPassword } = updateUser
    
      return 'Usuario Actualizado'
    }

    async updatetrainerUser(id:string){
      const serchUser = await this.usersRepository.findOneBy({ id })
  
      if(!serchUser){
          throw new BadRequestException ("Usuario Inexistente")
      }
  
      serchUser.role = 'trainer';
  
       await this.usersRepository.save(serchUser);
    }

///////////////////////////  AUTH

async getUserByEmail(email: string) {
  const user = await this.usersRepository.findOne({
    where: { email },
  });
  return user;
}  

async createUser(user: CreateUserDto) {
  try {
    const newUser = await this.usersRepository.save(user);
    return newUser;
  } catch (err) {
    throw new Error('Error al crear el usuario');
  }
}

/////////////////////
async findByAuth0Id(auth0Id: string): Promise<User> {
  return this.usersRepository.findOne({ where: { auth0Id } });
}
}