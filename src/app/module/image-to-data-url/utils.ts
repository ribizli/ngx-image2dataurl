import { ResizeOptions } from './interfaces';

export function createImage(url: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const image = new Image();
    image.onload = () => res(image);
    image.onerror = rej;
    image.src = url;
  });
}

export function resizeImage(origImage: HTMLImageElement, {
    resizeMaxHeight,
  resizeMaxWidth,
  resizeQuality = 0.7,
  resizeType = 'image/jpeg'
}: ResizeOptions = {}) {

  if (!document) return null;
  const canvas = document.createElement('canvas');

  let height = origImage.height;
  let width = origImage.width;

  if (width > resizeMaxWidth) {
    height = Math.round(height * resizeMaxWidth / width);
    width = resizeMaxWidth;
  }

  if (height > resizeMaxHeight) {
    width = Math.round(width * resizeMaxHeight / height);
    height = resizeMaxHeight;
  }

  canvas.width = width;
  canvas.height = height;

  //draw image on canvas
  const ctx = canvas.getContext("2d");
  ctx.drawImage(origImage, 0, 0, width, height);

  // get the data from canvas as 70% jpg (or specified type).
  return canvas.toDataURL(resizeType, resizeQuality);
}
