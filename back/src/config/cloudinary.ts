import { config as dotenvConfig } from  'dotenv'
import {v2 as cloudinary} from 'cloudinary'

dotenvConfig({path: '.env'})
const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET

} = process.env

export const CloudinaryConfig = {
    provide: 'CLOUDINARY',
    useFactory: () => {
    return cloudinary.config({
            cloud_name: CLOUDINARY_CLOUD_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET,
    })
    }
}