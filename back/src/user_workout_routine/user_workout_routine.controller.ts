import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
import { UserWorkoutRoutineService } from './user_workout_routine.service';
import { CreateUserWorkoutDto } from './dto/create-user_workout_routine.dto';
import { UpdateUserWorkoutDto } from './dto/update-user_workout_routine.dto';


@Controller('user-workout')
export class UserWorkoutRoutineController {
  constructor(private readonly service: UserWorkoutRoutineService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findById(id);
  }

  @Post('create/:id')
  create(@Param('id') id: string, @Body() dto: CreateUserWorkoutDto) {
    return this.service.create(id, dto);
  }


  @Put(':id')                                      ///SI NO SE LE PASA NADA POR BODY DEVUELVE LA RUTINA SIN MODIFICACIONES
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserWorkoutDto
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.delete(id);
  }
}
