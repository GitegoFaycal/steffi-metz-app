export default function getUploadedFileUrl(file) {
  if (!file) {
    return '';
  }

  return file.path || file.secure_url || file.url || '';
}