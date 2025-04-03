import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";


export class updateWorkoutRoutineDto{

@ApiProperty({
    description: 'Nombre del Plan con un minimo de 3 caracteres y maximo de 80 caracteres',
    example: 'Power Push'
})
@IsNotEmpty()
@IsString()
@Length(3,80)
name: string;
 
@ApiProperty({
    description: 'Descripción del Plan con un minimo de 3 caracteres y maximo de 500 caracteres',
    example: 'Día 1: Pecho/Tríceps, Press de banca: 4 series x 6-8 repeticiones, Press de banca inclinado: 3 series x 8-10 repeticiones, Fondos en paralelas: 3 series x 10-12 repeticiones, Extensiones de tríceps con polea: 3 series x 12-15 repeticiones, Flexiones diamante: 3 series hasta el fallo, Día 2: Espalda/Bíceps, Dominadas: 4 series x máximas repeticiones, Remo con barra: 4 series x 8-10 repeticiones, Peso muerto: 3 series x 6-8 repeticiones, Curl de bíceps con barra: 3 series x 10-12 repeticiones, Curl martillo: 3 series x 12 repeticiones, Día 3: Descanso o cardio ligero, Día 4: Hombros, Press militar: 4 series x 6-8 repeticiones, Elevaciones laterales: 3 series x 12-15 repeticiones, Face pulls: 3 series x 15 repeticiones, Encogimientos de hombros: 3 series x 12 repeticiones, Día 5: Piernas, Sentadillas: 4 series x 8-10 repeticiones, Prensa de piernas: 3 series x 10-12 repeticiones, Extensiones de cuádriceps: 3 series x 12-15 repeticiones, Curl de isquiotibiales: 3 series x 12-15 repeticiones, Elevaciones de pantorrillas: 4 series x 15-20 repeticiones'
})
@IsNotEmpty()
@IsString()
@Length(3,500)
description: string;
    
@ApiProperty({
    description: 'Imagen del Plan con un minimo de 3 caracteres y maximo de 500 caracteres',
    example: 'https://example.com/image.png'
})
@IsNotEmpty()
@IsString()
@Length(3,200)    
imageUrl: string;
}