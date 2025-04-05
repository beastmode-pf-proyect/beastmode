import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Roles } from "src/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor( private readonly reflector: Reflector){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(
            'role', [context.getHandler(),context.getClass()])
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log(`request de usuario: ${request.user.role}`); //////////// VER ROLESSS!!!
        const hasRole = () => 
            requiredRoles.some((role) => {
                console.log(`Comparing role ${role} with user roles ${user?.role}`);
                return user?.role?.includes(role);
})
        const valid = user && user.roles && hasRole()
        console.log('Is valid?', valid);
        if(!valid){
            throw new ForbiddenException('You do not have permission and are not allowed to access this route')
        }
        return valid;
    }
}