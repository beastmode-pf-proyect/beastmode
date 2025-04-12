/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import { Observable } from "rxjs";


@Injectable()
export class validateWorkoutRoutineInteceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const body = { ...request.body};
        const {name, description} = body;
        const {file} = request.file;

        if(!description){
            throw new BadRequestException (`Falta rellenar el campo ${description}`);
        }else if(!name){
            throw new BadRequestException (`Falta rellenar el campo ${name}`);
        }
        
        return next.handle();
    }
}