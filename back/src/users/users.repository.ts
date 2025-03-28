import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/dto/createUserDto";
import { User } from "src/entities/users.entity";
import { Repository } from "typeorm";


export class UsersRepository{
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ){}

    async getUserByEmail(email: string) {
        const user = await this.usersRepository.findOne({
          where: { email },
        });
        return user;
      }  

      async createUser(user: Partial<User>) {
        try {
            const newUser = await this.usersRepository.save(user);
            return newUser;
          } catch (err) {
            throw new Error('Error al crear el usuario');
          }
        }

}