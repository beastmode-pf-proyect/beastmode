import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createTestimonyDto } from "src/dto/createTestimonyDto";
import { Testimony } from "src/entities/testimonies.entity";
import { Repository } from "typeorm";

export class testimoniesRepository{
    constructor(
        @InjectRepository(Testimony) 
        private testimoniesRepository: Repository<Testimony>,
    ){}

    async createTestimonie(testimonie: createTestimonyDto) {
        const createdTestimonie = await this.testimoniesRepository.save(testimonie);
    
        if (!createdTestimonie) {
            throw new Error('No se pudo crear el testimonio');
        }
    
        return `Testimonio de ${createdTestimonie.fullName} creada exitosamente`;
    }


    async getTestimonials() : Promise <Testimony[]> {
        const testimonials = await this.testimoniesRepository.find()
        return testimonials;
    }

    async updateTestimonie(id: string, updateTestimonial: Partial<Testimony>){
        const testimony = await this.testimoniesRepository.findOneBy({ id })
        if(!testimony){
            throw new NotFoundException('Testimonio no encontrado')
        }

        await this.testimoniesRepository.update(id, updateTestimonial)

        return `Testimonio actualizado de: ${testimony.fullName}`
    }
}