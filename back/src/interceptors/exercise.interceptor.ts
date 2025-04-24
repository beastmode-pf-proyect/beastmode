/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class ExerciseValidationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const request = context.switchToHttp().getRequest();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const body = request.body;
        
        // Validación básica de campos requeridos
        if (!body.name) {
            throw new BadRequestException('El campo name es requerido');
        }
        if (!body.description) {
            throw new BadRequestException('El campo description es requerido');
        }
        
        if (!body.category){
            throw new BadRequestException('El campo category es requerido');
        }
        
        // Validación simple de URLs si están presentes
        if (body.imageUrl && !this.isValidUrl(body.imageUrl)) {
            throw new BadRequestException('El campo imageUrl debe ser una URL válida');
        }
        
        if (body.videoUrl && !this.isValidUrl(body.videoUrl)) {
            throw new BadRequestException('El campo videoUrl debe ser una URL válida');
        }

        return next.handle();
    }
    
    private isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}