import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { WorkoutRoutineService } from './workout-routine.service';
import { Role } from 'src/decorators/roles.decorators';
import { Roles } from 'src/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuardian } from 'src/guards/authorization.guard';
import { updateWorkoutRoutineDto } from 'src/dto/updateWorkoutRoutineDto';
import { WorkoutRoutine } from 'src/entities/workout.routine.entity';
import { validateWorkoutRoutineInteceptor } from 'src/interceptors/validateWorkoutRutine.interceptor';

@Controller('workout-routine')
export class WorkoutRoutineController {
  constructor(private readonly workoutRoutineService: WorkoutRoutineService) {}

  @Get()
  getWorkoutRoutine(){
    return this.workoutRoutineService.getWorkoutRoutines()
  }

  @Get(':id')
  @Role(Roles.Admin, Roles.Trainer)
  @UseGuards(AuthGuardian, RolesGuard)
  getWorkoutRoutineById(@Param('id', ParseUUIDPipe) id: string){
    return this.workoutRoutineService.getWorkoutRoutineById(id)
  }

  @Put(':id')
  @Role(Roles.Admin, Roles.Trainer)
  @UseGuards(AuthGuardian, RolesGuard)
  @UseInterceptors(validateWorkoutRoutineInteceptor)
  updateWorkoutRoutine(@Param('id', ParseUUIDPipe) id: string, updateWorkoutRoutine: updateWorkoutRoutineDto){
    return this.workoutRoutineService.updateWorkoutRoutine(id, updateWorkoutRoutine)
  }

  @Post('create')
  @Role(Roles.Admin, Roles.Trainer)
  @UseGuards(AuthGuardian, RolesGuard)
  @UseInterceptors(validateWorkoutRoutineInteceptor)
  createWorkoutRoutine(@Body() WorkoutRoutine: Partial<WorkoutRoutine>){
    return this.workoutRoutineService.createWorkoutRoutine(WorkoutRoutine)
  }

  @Put('desactivate/:id')
  @Role(Roles.Admin, Roles.Trainer)
  @UseGuards(AuthGuardian, RolesGuard)
  desactivateWorkoutRoutine(@Param('id', ParseUUIDPipe) id: string){
    return this.workoutRoutineService.desactivateWorkoutRoutine(id)
  }

  @Put('activate/:id')
  @Role(Roles.Admin, Roles.Trainer)
  @UseGuards(AuthGuardian, RolesGuard)
  activateWorkoutRoutine(@Param('id', ParseUUIDPipe) id: string){
    return this.workoutRoutineService.activateWorkoutRoutine(id)
  }
}
