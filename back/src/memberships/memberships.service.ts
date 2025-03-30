import { Injectable } from '@nestjs/common';
import { MembershipsRepository } from './memberships.repository';
import { updateMembershipDto } from 'src/dto/updateMembershipDto';
import { MembershipPlan } from 'src/entities/membership.plan.entity';

@Injectable()
export class MembershipsService {
 constructor( private readonly membershipRepository: MembershipsRepository){}

getMemberships(){
    return this.membershipRepository.getMemberships()
}

getMembershipById(id: string){
    return this.membershipRepository.getMembershipById(id)
}

updateMembership(id: string, updateMembership: updateMembershipDto){
    return this.membershipRepository.updateMembership(id, updateMembership)
}

createMembership(membership: Partial<MembershipPlan>){
    return this.membershipRepository.createMembership(membership)
}

desactivateMembership(id: string){
    return this.membershipRepository.desactivateMembership(id)
}

activateMembership(id: string){
    return this.membershipRepository.activateMembership(id)
}

}
