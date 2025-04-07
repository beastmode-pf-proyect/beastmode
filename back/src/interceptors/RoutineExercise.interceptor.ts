import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RoutineExerciseValidationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const request = context.switchToHttp().getRequest();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const body = request.body;
        
        // Validación de campos requeridos
        if (!body.routineId) {
            throw new BadRequestException('El campo routine es requerido');
        }
        if (!body.exerciseId) {
            throw new BadRequestException('El campo exercise es requerido');
        }
        if (body.sets === undefined || body.sets === null) {
            throw new BadRequestException('El campo sets es requerido');
        }
        if (body.reps === undefined || body.reps === null) {
            throw new BadRequestException('El campo reps es requerido');
        }
        if (body.order === undefined || body.order === null) {
            throw new BadRequestException('El campo order es requerido');
        }
        
        // Validación de tipos numéricos
        if (body.sets !== undefined && typeof body.sets !== 'number') {
            throw new BadRequestException('El campo sets debe ser un número');
        }
        if (body.reps !== undefined && typeof body.reps !== 'number') {
            throw new BadRequestException('El campo reps debe ser un número');
        }
        if (body.duration !== undefined && body.duration !== null && typeof body.duration !== 'number') {
            throw new BadRequestException('El campo duration debe ser un número');
        }
        if (body.rest !== undefined && body.rest !== null && typeof body.rest !== 'number') {
            throw new BadRequestException('El campo rest debe ser un número');
        }
        if (body.order !== undefined && typeof body.order !== 'number') {
            throw new BadRequestException('El campo order debe ser un número');
        }
        
        return next.handle();
    }
}