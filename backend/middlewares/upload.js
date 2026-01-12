import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// CLOUDINARY CONFIGURATION
cloudinary.config({
    cloud_name: "dmkxa7m25",
    api_key: "814764919897649",
    api_secret: "pop2caVueFE082aDuORdlopeqxw",
});

// CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bookworm-users', // Cloudinary folder name
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional: resize image
    },
});

// MULTER UPLOAD
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

export default upload;