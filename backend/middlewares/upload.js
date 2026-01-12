import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// GET CURRENT DIRECTORY (ES6 Module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// STORAGE CONFIGURATION
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// FILE FILTER
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, JPEG, PNG, and GIF files are allowed!'), false);
    }
};

// MULTER UPLOAD
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: fileFilter
});

export default upload;