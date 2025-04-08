import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put,  UseGuards, UseInterceptors,} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoutineExerciseService } from './routine_exercise.service';
import { CreateRoutineExerciseDto } from './dto/create-routine_exercise.dto';
import { UpdateRoutineExerciseDto } from './dto/update-routine_exercise.dto';
import { RoutineExerciseValidationInterceptor } from 'src/interceptors/RoutineExercise.interceptor';

@ApiTags('routine-exercises')
@Controller('routine-exercises')
export class RoutineExerciseController {
    constructor(private readonly service: RoutineExerciseService) {}

    @UseInterceptors(RoutineExerciseValidationInterceptor)
    @Post('create')
    create(@Body() createDto: CreateRoutineExerciseDto) {
        return this.service.create(createDto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get('routine-exercises/:routineId')
    findByRoutineId(@Param('routineId', ParseUUIDPipe) routineId: string) {
        return this.service.findByRoutineId(routineId);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.service.findOne(id);
    }

    @UseInterceptors(RoutineExerciseValidationInterceptor)
    @Put(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateRoutineExerciseDto,
    ) {
        return this.service.update(id, updateDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.service.delete(id);
    }
}