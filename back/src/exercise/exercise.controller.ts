import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  Put,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ApiTags } from '@nestjs/swagger';
import { ExerciseValidationInterceptor } from 'src/interceptors/exercise.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('exercises')
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @UseInterceptors(ExerciseValidationInterceptor)
  @Post('create')
  @UseInterceptors(FileInterceptor('file')) // Añade este interceptor
  create(
    @Body() createExerciseDto: CreateExerciseDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp|gif|mp4)$/ }),
        ],
      }),
    )
    file?: Express.Multer.File, // Hacerlo opcional
  ) {
    return this.exerciseService.create(createExerciseDto, file);
  }

  @Get()
  findAll() {
    return this.exerciseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.exerciseService.findOne(id);
  }

  @UseInterceptors(ExerciseValidationInterceptor)
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exerciseService.update(id, updateExerciseDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.exerciseService.delete(id);
  }
}
