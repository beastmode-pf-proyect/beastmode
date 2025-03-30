import { Injectable } from '@nestjs/common';
import * as data from '../utils/Testimonials.json'

@Injectable()
export class TestimonialsService {
    private data = require('../utils/Testimonials.json');

addTestimonials(cantidad = data.length){
    const testimonialCopy = [...this.data];

    for (let i = testimonialCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [testimonialCopy[i], testimonialCopy[j]] = [testimonialCopy[j], testimonialCopy[i]];
    }
    
    return testimonialCopy.slice(0, cantidad)
}
}




