import db from '../config/db.js';

export default async function addImageToGallery({
  title,
  category,
  image,
}) {
  if (!image) {
    return;
  }

  await db.query(
    `
    INSERT INTO gallery (
      title,
      category,
      image
    )
    VALUES (?, ?, ?)
    `,
    [
      title || 'Uploaded Image',
      category || 'general',
      image,
    ]
  );
}