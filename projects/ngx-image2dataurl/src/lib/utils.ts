import { ResizeOptions } from './interfaces';

export function createImageFromDataUrl(dataURL: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const image = new Image();
    image.onload = () => res(image);
    image.onerror = rej;
    image.src = dataURL;
  });
}

export async function resizeImage(dataURL: string, {
  maxHeight,
  maxWidth,
  quality = 0.7,
  type = getImageTypeFromDataUrl(dataURL)
}: ResizeOptions = {}) {

  const image = await createImageFromDataUrl(dataURL);

  if (!document) throw new Error('Work only in browser, document not defined');
  const canvas = document.createElement('canvas');

  let height = image.height;
  let width = image.width;

  if (width > maxWidth) {
    height = Math.round(height * maxWidth / width);
    width = maxWidth;
  }

  if (height > maxHeight ) {
    width = Math.round(width * maxHeight / height);
    height = maxHeight;
  }

  canvas.width = width;
  canvas.height = height;

  //draw image on canvas
  const ctx = canvas.getContext("2d");
  
  if(type !== 'image/png'){
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  ctx.drawImage(image, 0, 0, width, height);

  // get the data from canvas as 70% jpg (or specified type).
  return canvas.toDataURL(type, quality);
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}

const typeRE = /^data:([^,;]+)/;
export function getImageTypeFromDataUrl(dataURL: string): string {
  let matches = dataURL.match(typeRE);
  return matches && matches[1] || undefined;
}
