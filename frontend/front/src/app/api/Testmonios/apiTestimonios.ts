import { NextApiRequest, NextApiResponse } from "next";
import { ITestimonios } from "@/Components/interfaces/testimonios";

const testimonials: ITestimonios[] = [];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ITestimonios[] | ITestimonios>
) {
  if (req.method === "POST") {
    const newTestimonial: Partial<ITestimonios> = req.body;
    const testimonial: ITestimonios = {
      nombre: newTestimonial.nombre || "",
      descripcion: newTestimonial.descripcion || "",
      calificacion: newTestimonial.calificacion || "",
      calificacionNumero: newTestimonial.calificacionNumero || 0,
      imagen: newTestimonial.imagen || "",
    };
    testimonials.push(testimonial);
    res.status(201).json(testimonial);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
