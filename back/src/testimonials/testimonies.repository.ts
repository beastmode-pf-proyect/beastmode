import { InjectRepository } from "@nestjs/typeorm";
import { Testimony } from "src/entities/testimonies.entity";
import { Repository } from "typeorm";

export class testimoniesRepository{
    constructor(
        @InjectRepository(Testimony) private testimoniesRepository: Repository<Testimony>
    ){}

async createTestimonie(testimonie: Partial<Testimony>){
    
        const createdTestimonie = await this.testimoniesRepository.save(testimonie);
    
        if (!testimonie) {
            throw new Error('No se pudo crear el testimonio');
        }
    
        return `Testimonio de ${testimonie.fullName} creada exitosamente`;
    }
}