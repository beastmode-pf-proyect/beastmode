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
        if (!body.user) {
            throw new BadRequestException('El campo user es requerido');
        }
        if (!body.membershipPlan) {
            throw new BadRequestException('El campo membershipPlan es requerido');
        }
        if (!body.startDate) {
            throw new BadRequestException('El campo startDate es requerido');
        }
        if (!body.endDate) {
            throw new BadRequestException('El campo endDate es requerido');
        }
        
        // Validación simple de fechas
        if (new Date(body.startDate) >= new Date(body.endDate)) {
            throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
        }
        
        return next.handle();
    }
}