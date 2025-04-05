import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, UseInterceptors, Put, UseGuards } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ApiTags } from '@nestjs/swagger';
import { ExerciseValidationInterceptor } from 'src/interceptors/exercise.interceptor';
import { AuthGuardian } from 'src/guards/authorization.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('exercises')
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @UseInterceptors(ExerciseValidationInterceptor)
  @Post('create')  
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exerciseService.create(createExerciseDto);
  }

  @Get() 
  findAll() {
    return this.exerciseService.findAll();
  }

  @Get(':id')  
  //@UseGuards(AuthGuardian, RolesGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.exerciseService.findOne(id);
  }

  @UseInterceptors(ExerciseValidationInterceptor)
  //@UseGuards(AuthGuardian, RolesGuard)
  @Put(':id')  
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exerciseService.update(id, updateExerciseDto);
  }


  //@UseGuards(AuthGuardian, RolesGuard)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.exerciseService.delete(id);
  }
}