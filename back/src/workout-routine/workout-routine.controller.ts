import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseUUIDPipe, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { WorkoutRoutineService } from './workout-routine.service';
import { updateWorkoutRoutineDto } from 'src/dto/updateWorkoutRoutineDto';
import { WorkoutRoutine } from 'src/entities/workout.routine.entity';
import { validateWorkoutRoutineInteceptor } from 'src/interceptors/validateWorkoutRutine.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('workout-routine')
export class WorkoutRoutineController {
  constructor(private readonly workoutRoutineService: WorkoutRoutineService) {}

  @Get()
  getWorkoutRoutine(){
    return this.workoutRoutineService.getWorkoutRoutines()
  }

  @Get(':id')
  getWorkoutRoutineById(@Param('id', ParseUUIDPipe) id: string){
    return this.workoutRoutineService.getWorkoutRoutineById(id)
  }

  @Put(':id')
  @UseInterceptors(validateWorkoutRoutineInteceptor)
  updateWorkoutRoutine(@Param('id', ParseUUIDPipe) id: string, updateWorkoutRoutine: updateWorkoutRoutineDto){
    return this.workoutRoutineService.updateWorkoutRoutine(id, updateWorkoutRoutine)
  }

  @Post('create')
  @UseInterceptors(
  FileInterceptor('file'), // Añade esto para manejar archivos
    validateWorkoutRoutineInteceptor
  )
  async createWorkoutRoutine(
    @Body() workoutRoutine: Partial<WorkoutRoutine>,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp|gif|mp4)$/ }),
        ],
        fileIsRequired: false, // Hacer el archivo opcional
      })
    ) file?: Express.Multer.File
  ) {
    return this.workoutRoutineService.createWorkoutRoutine(workoutRoutine, file);
}

  @Put('desactivate/:id')
  desactivateWorkoutRoutine(@Param('id', ParseUUIDPipe) id: string){
    return this.workoutRoutineService.desactivateWorkoutRoutine(id)
  }

  @Put('activate/:id')
  activateWorkoutRoutine(@Param('id', ParseUUIDPipe) id: string){
    return this.workoutRoutineService.activateWorkoutRoutine(id)
  }
}
