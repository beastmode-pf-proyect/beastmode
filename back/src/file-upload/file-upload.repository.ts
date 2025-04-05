/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { Injectable } from "@nestjs/common";
import { UploadApiResponse, v2 as Cloudinary } from "cloudinary";
import * as toStream from 'buffer-to-stream';


@Injectable()
export class FileUploadRepository {

    
     //Sube una imagen a Cloudinary.
     //@param file - La imagen que se va a subir.
     //@returns La respuesta de Cloudinary con la URL de la imagen subida.
    
    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            // Prepara la subida del archivo a Cloudinary.
            const upload = Cloudinary.uploader.upload_stream(
                { resource_type: 'auto' }, // Cloudinary detecta automáticamente el tipo de archivo.
                (error, result) => {
                    if (error) {
                        reject(error); // Si hay un error, se rechaza la promesa.
                    } else {
                        if (result) {
                            resolve(result); // Si todo va bien, se devuelve el resultado.
                        } else {
                            reject(new Error('Upload result is undefined')); // Maneja el caso en que el resultado sea undefined.
                        }
                    }
                }
            );            
            toStream(file.buffer).pipe(upload);
        });
    }
}