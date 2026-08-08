import sharp from 'sharp';

const TARGET_SIZE = 9 * 1024 * 1024;
const MAX_WIDTH = 2400;
const MAX_HEIGHT = 2400;

export default async function optimizeImage(inputBuffer) {
  let quality = 82;

  const createOutput = async (currentQuality) => {
    return sharp(inputBuffer, {
      failOn: 'none',
      limitInputPixels: false,
    })
      .autoOrient()
      .resize({
        width: MAX_WIDTH,
        height: MAX_HEIGHT,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: currentQuality,
        effort: 4,
        smartSubsample: true,
      })
      .toBuffer();
  };

  let outputBuffer = await createOutput(quality);

  while (outputBuffer.length > TARGET_SIZE && quality > 45) {
    quality -= 7;
    outputBuffer = await createOutput(quality);
  }

  if (outputBuffer.length > TARGET_SIZE) {
    outputBuffer = await sharp(outputBuffer)
      .resize({
        width: 1800,
        height: 1800,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: 68,
        effort: 5,
      })
      .toBuffer();
  }

  if (outputBuffer.length > TARGET_SIZE) {
    outputBuffer = await sharp(outputBuffer)
      .resize({
        width: 1400,
        height: 1400,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: 58,
        effort: 6,
      })
      .toBuffer();
  }

  if (outputBuffer.length > TARGET_SIZE) {
    throw new Error(
      'The image could not be reduced below the Cloudinary upload limit.'
    );
  }

  return {
    buffer: outputBuffer,
    format: 'webp',
    mimetype: 'image/webp',
    extension: '.webp',
    size: outputBuffer.length,
  };
}