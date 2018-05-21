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
    maxHeight,
  maxWidth,
  quality = 0.7,
  type = 'image/jpeg'
}: ResizeOptions = {}) {

  if (!document) throw new Error('Work only in browser, document not defined');
  const canvas = document.createElement('canvas');

  let height = origImage.height;
  let width = origImage.width;

  if (width > maxWidth) {
    height = Math.round(height * maxWidth / width);
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = Math.round(width * maxHeight / height);
    height = maxHeight;
  }

  canvas.width = width;
  canvas.height = height;

  //draw image on canvas
  const ctx = canvas.getContext("2d");
  ctx.drawImage(origImage, 0, 0, width, height);

  // get the data from canvas as 70% jpg (or specified type).
  return canvas.toDataURL(type, quality);
}
