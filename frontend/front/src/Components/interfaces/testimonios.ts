import { StaticImageData } from "next/image";

export interface ITestimonios {
  nombre: string;
  descripcion: string;
  calificacion: string;
  calificacionNumero: number;
  imagen: string | StaticImageData;
}