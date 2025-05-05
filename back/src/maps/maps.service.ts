import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GymLocation } from '../entities/maps.entity';
import { LocationDto } from 'src/dto/locationDto';

@Injectable()
export class MapsService {
  private apiKey: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(GymLocation)
    private gymLocationsRepository: Repository<GymLocation>,
  ) {
    this.apiKey = this.configService.get<string>('MAPTILER_API_KEY');
  }

  getApiKey(): string {
    return this.apiKey;
  }

  async getAllLocations(): Promise<GymLocation[]> {
    return this.gymLocationsRepository.find();
  }

  async getLocationById(id: string): Promise<GymLocation> {
    return this.gymLocationsRepository.findOne({ where: { id } });
  }

  async createLocation(locationData: LocationDto): Promise<GymLocation> {
    const newLocation = this.gymLocationsRepository.create(locationData);
    return this.gymLocationsRepository.save(newLocation);
  }

  async updateLocation(id: string, locationData: LocationDto): Promise<GymLocation> {
    await this.gymLocationsRepository.update(id, locationData);
    return this.getLocationById(id);
  }

  async deleteLocation(id: string): Promise<void> {
    await this.gymLocationsRepository.delete(id);
  }
}