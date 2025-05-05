import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/entities/roles.entity";
import { Repository } from "typeorm";

export class RolesRepository{
    constructor(
        @InjectRepository(Role) private roleRepository: Repository<Role>,
    ){}

async findOne(role: string) {
    return  this.roleRepository.findOne({
        where: { name: role }
      })
}

}