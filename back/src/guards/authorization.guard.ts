import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuardian implements CanActivate{
    constructor( private readonly jwtService: JwtService){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization?.split(' ')[1] ?? '';

        if (!authHeader){
            throw new UnauthorizedException("Bearer Token not found")
        }

        try{
            const secret = process.env.JWT_SECRET;
            const payload = this.jwtService.verify(authHeader, {secret})

            payload.iat = new Date (payload.iat * 1000)
            payload.exp = new Date (payload.exp * 1000)

            if(payload.isAdmin) payload.roles = ['admin']
            else if(payload.isTrainer) payload.roles = ['trainer']
            else payload.roles = ['user']

            request.user = payload
            return true;
        } catch (err) {
            throw new UnauthorizedException("Invalid token")
        }
    }
}