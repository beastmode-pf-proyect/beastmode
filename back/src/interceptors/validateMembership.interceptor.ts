import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import { Observable } from "rxjs";


@Injectable()
export class validateMembershipInteceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const body = { ...request.body};
        const {name, price, duration, description} = body;

        if(!price){
            throw new BadRequestException (`Falta rellenar el campo ${price}`);
        }else if(!name){
            throw new BadRequestException (`Falta rellenar el campo ${name}`);
        }else if(!duration){
            throw new BadRequestException (`Falta rellenar el campo ${duration}`);
        }else if(!description){
            throw new BadRequestException (`Falta rellenar el campo ${description}`);
        }
        
        return next.handle();
    }
}