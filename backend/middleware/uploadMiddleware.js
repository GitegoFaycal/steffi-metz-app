import multer from 'multer';
import path from 'path';
import fs from 'fs';

function createStorage(folderName) {
  const uploadPath = path.join(process.cwd(), 'uploads', folderName);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}`;

      const fileExtension = path.extname(file.originalname);

      cb(null, `${uniqueSuffix}${fileExtension}`);
    },
  });
}

function fileFilter(req, file, cb) {
  const allowedExtensions = /jpg|jpeg|png|webp/;
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();

  const isValidExtension = allowedExtensions.test(fileExtension);
  const isValidMimeType = mimeType.startsWith('image/');

  if (isValidExtension && isValidMimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, and WEBP image files are allowed.'));
  }
}

export function uploadTo(folderName) {
  return multer({
    storage: createStorage(folderName),
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
}