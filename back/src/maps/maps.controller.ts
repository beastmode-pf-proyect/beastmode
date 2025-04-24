import { Controller, Get, Post, Body, Param, Put, Delete, HttpStatus, HttpCode, Render } from '@nestjs/common';
import { MapsService } from './maps.service';
import { LocationDto } from 'src/dto/locationDto';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('view')
  @Render('index')
  async viewMap() {
    const locations = await this.mapsService.getAllLocations();
    return {
      title: 'Sedes del Gimnasio',
      apiKey: this.mapsService.getApiKey(),
      locations: locations
    };
  }

  @Get('api-key')
  getMapApiKey() {
    return { apiKey: this.mapsService.getApiKey() };
  }

  @Get('locations')
  async getAllLocations() {
    const locations = await this.mapsService.getAllLocations();
    return { locations };
  }

  @Get('locations/:id')
  async getLocationById(@Param('id') id: string) {
    const location = await this.mapsService.getLocationById(id);
    return { location };
  }

  @Post('locations')
  async createLocation(@Body() locationData: LocationDto) {
    const newLocation = await this.mapsService.createLocation(locationData);
    return { location: newLocation };
  }

  @Put('locations/:id')
  async updateLocation(@Param('id') id: string, @Body() locationData: LocationDto) {
    const updatedLocation = await this.mapsService.updateLocation(id, locationData);
    return { location: updatedLocation };
  }

  @Delete('locations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLocation(@Param('id') id: string) {
    await this.mapsService.deleteLocation(id);
  }
}