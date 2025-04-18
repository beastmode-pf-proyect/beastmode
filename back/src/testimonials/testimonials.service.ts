import { Injectable } from '@nestjs/common';
import { Testimony } from 'src/entities/testimonies.entity';
import { testimoniesRepository } from './testimonies.repository';

@Injectable()
export class TestimonialsService {
    constructor(private testimoniesRepository: testimoniesRepository){}

addTestimonial(testimonies: Partial<Testimony>){
    return this.testimoniesRepository.createTestimonie(testimonies)
}

getTestimonials(){
    return this.testimoniesRepository.getTestimonials()   
}

updateTestimonial(id: string, updateTestimonial: Partial<Testimony>){
    return this.testimoniesRepository.updateTestimonie(id, updateTestimonial)

}

}




