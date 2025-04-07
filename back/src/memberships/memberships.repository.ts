import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { updateMembershipDto } from "src/dto/updateMembershipDto";
import { MembershipPlan } from "src/entities/membership.plan.entity";
import { Repository } from "typeorm";


export class MembershipsRepository{
    constructor(
        @InjectRepository(MembershipPlan) private membershipRepository: Repository<MembershipPlan>,
    ){}


    async getMemberships() : Promise <MembershipPlan[]> {

        const memberships = await this.membershipRepository.find()
        return memberships;
          
    }

    async getMembershipById(id: string){

        const membership = await this.membershipRepository.findOneBy({ id })
        if(!membership){
            throw new NotFoundException('Membresia Inexistente')
        }

        return membership
    }

    async updateMembership(id: string, updateMembership: updateMembershipDto) {

        await this.membershipRepository.update( id, updateMembership)

        const updatedMembership = await this.membershipRepository.findOneBy({ id })

        return `Membresia actualizada: ${updatedMembership.name}`

    }

    async createMembership(membership: Partial<MembershipPlan>){
    
        const createdMembership = await this.membershipRepository.save(membership);
    
        if (!createdMembership) {
            throw new Error('No se pudo crear la membresía');
        }
    
        return `Membresía ${createdMembership.name} creada exitosamente`;
    }

    async desactivateMembership(id:string){

        const findingMembership = await this.membershipRepository.findOneBy({ id })

        if(!findingMembership){
            throw new NotFoundException ('Membresia no encontrada')
        }

        findingMembership.isActive = false

        return `Membresia ${findingMembership.name} desactivada exitosamente`
    }

    async activateMembership(id:string){

        const findingMembership = await this.membershipRepository.findOneBy({ id })

        if(!findingMembership){
            throw new NotFoundException ('Membresia no encontrada')
        }

        findingMembership.isActive = true

        return `Membresia ${findingMembership.name} activada exitosamente`
    }

}