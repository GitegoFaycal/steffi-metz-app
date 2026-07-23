import fs from 'fs';
import path from 'path';

export default function deleteFile(filePath) {
  if (!filePath) {
    return;
  }

  const clearPath = filePath.startsWith('/')
    ? filePath.slice(1)
    : filePath;

  const fullPath = path.join(process.cwd(), clearPath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}