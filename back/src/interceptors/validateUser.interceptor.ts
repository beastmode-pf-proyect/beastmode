import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import { Observable } from "rxjs";


@Injectable()
export class validateUserInteceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const body = { ...request.body};
        const {email, password, confirmPassword,} = body;

        if(!email || !password  || !confirmPassword ){
            throw new BadRequestException ("Faltan datos obligatorios. Por favor verifica el cuerpo de la solicitud.")
        }
        
        return next.handle();
    }
}