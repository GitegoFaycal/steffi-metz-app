import multer from 'multer';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import optimizeImage from '../utils/optimizeImage.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_INPUT_SIZE = 100 * 1024 * 1024;

const parser = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_INPUT_SIZE,
    files: 20,
  },

  fileFilter: (req, file, callback) => {
    if (file.mimetype?.startsWith('image/')) {
      callback(null, true);
      return;
    }

    callback(
      new Error('Only image files can be uploaded.')
    );
  },
});

function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

function createPublicId(file) {
  const baseName = String(file.originalname || 'image')
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 70);

  return `${file.fieldname}-${baseName}-${Date.now()}`;
}

async function optimizeAndUploadFile(file, folderName) {
  if (!file?.buffer) {
    return file;
  }

  const optimized = await optimizeImage(file.buffer);

  const result = await uploadBuffer(optimized.buffer, {
    folder: `steffi-metz/${folderName}`,
    public_id: createPublicId(file),
    resource_type: 'image',
    format: 'webp',
    overwrite: false,
  });

  return {
    ...file,
    buffer: undefined,
    path: result.secure_url,
    url: result.secure_url,
    secure_url: result.secure_url,
    filename: result.public_id,
    public_id: result.public_id,
    mimetype: optimized.mimetype,
    size: optimized.size,
    cloudinary: result,
  };
}

async function processUploadedFiles(req, folderName) {
  if (req.file) {
    req.file = await optimizeAndUploadFile(
      req.file,
      folderName
    );
  }

  if (Array.isArray(req.files)) {
    req.files = await Promise.all(
      req.files.map((file) =>
        optimizeAndUploadFile(file, folderName)
      )
    );
  }

  if (
    req.files &&
    !Array.isArray(req.files) &&
    typeof req.files === 'object'
  ) {
    const fieldEntries = Object.entries(req.files);

    for (const [fieldName, files] of fieldEntries) {
      req.files[fieldName] = await Promise.all(
        files.map((file) =>
          optimizeAndUploadFile(file, folderName)
        )
      );
    }
  }
}

function wrapUploadMiddleware(
  multerMiddleware,
  folderName
) {
  return (req, res, next) => {
    multerMiddleware(req, res, async (error) => {
      if (error) {
        next(error);
        return;
      }

      try {
        await processUploadedFiles(req, folderName);
        next();
      } catch (uploadError) {
        next(uploadError);
      }
    });
  };
}

export function uploadTo(folderName) {
  return {
    single(fieldName) {
      return wrapUploadMiddleware(
        parser.single(fieldName),
        folderName
      );
    },

    array(fieldName, maxCount = 20) {
      return wrapUploadMiddleware(
        parser.array(fieldName, maxCount),
        folderName
      );
    },

    fields(fieldDefinitions) {
      return wrapUploadMiddleware(
        parser.fields(fieldDefinitions),
        folderName
      );
    },
  };
}

export { cloudinary };
