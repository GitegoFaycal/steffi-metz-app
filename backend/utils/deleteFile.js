import fs from 'fs';
import path from 'path';

export default function deleteFile(filePath) {
  try {
    if (!filePath) {
      return;
    }

    // If the image is stored on Cloudinary, it will be an https URL.
    // For now, we skip deleting Cloudinary files.
    if (filePath.startsWith('http')) {
      return;
    }

    const cleanPath = filePath.startsWith('/')
      ? filePath.slice(1)
      : filePath;

    const fullPath = path.join(process.cwd(), cleanPath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error('DELETE FILE ERROR:', error.message);
  }
}