import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class SubscriptionValidationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const request = context.switchToHttp().getRequest();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const body = request.body;
        
        // Validación básica de campos requeridos
        if (!body.name) {
            throw new BadRequestException('El campo name es requerido');
        }
        if (!body.address) {
            throw new BadRequestException('El campo address es requerido');
        }
        if (!body.longitude) {
            throw new BadRequestException('El campo longitude es requerido');
        }
        if (!body.latitude) {
            throw new BadRequestException('El campo latitude es requerido');
        }
        
        return next.handle();
    }
}