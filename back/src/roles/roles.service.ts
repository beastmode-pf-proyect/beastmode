import { Injectable } from '@nestjs/common';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
    constructor (private readonly rolesRepository : RolesRepository){}


getRoleByName(role: string){
    return this.rolesRepository.findOne(role)
}

}
