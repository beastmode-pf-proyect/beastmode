import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class TestimonialsValidationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        
        const request = context.switchToHttp().getRequest();
        
        const body = request.body;
        
       
        if (!body.fullName) {
            throw new BadRequestException('El campo fullName es requerido');
        }
        if (!body.age) {
            throw new BadRequestException('El campo age es requerido');
        }
        if (!body.occupation) {
            throw new BadRequestException('El campo occupation es requerido');
        }
        if (!body.content) {
            throw new BadRequestException('El campo content es requerido');
        }
        if (!body.score) {
            throw new BadRequestException('El campo score es requerido');
        }
        
        return next.handle();
    }
}