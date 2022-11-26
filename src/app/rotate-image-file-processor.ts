import { createImageFromDataUrl, getImageTypeFromDataUrl, ImageFileProcessor } from 'ngx-image2dataurl';
import { Injectable } from '@angular/core';

@Injectable()
export class RotateImageFileProcessor implements ImageFileProcessor {
  async process(dataURL: string): Promise<string> {
    const canvas = document.createElement('canvas');
    const image = await createImageFromDataUrl(dataURL);
    canvas.width = image.height;
    canvas.height = image.width;
    const ctx = canvas.getContext('2d');
    //ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    //ctx.restore();
    return canvas.toDataURL(getImageTypeFromDataUrl(dataURL));
  }
}
