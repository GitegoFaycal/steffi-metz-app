import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

function fileFilter(req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    allowedExtensions.includes(extension) &&
    allowedMimeTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only JPG, JPEG, PNG, and WEBP image files are allowed.'
      )
    );
  }
}

function createCloudinaryStorage(folderName) {
  return new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const extension = path
        .extname(file.originalname)
        .toLowerCase()
        .replace('.', '');

      const uniqueSuffix = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}`;

      return {
        folder: `steffi-metz/${folderName}`,
        public_id: `${file.fieldname}-${uniqueSuffix}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        resource_type: 'image',
        format: extension === 'jpg' ? 'jpg' : extension,
      };
    },
  });
}

export function uploadTo(folderName) {
  return multer({
    storage: createCloudinaryStorage(folderName),
    fileFilter,
    limits: {
      fileSize: 25 * 1024 * 1024,
    },
  });
}

export { cloudinary };