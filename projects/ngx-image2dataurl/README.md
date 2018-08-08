# ngx-image2dataurl
An Angular component which reads the `dataURL` and optionally resizes the selected input file image.

[Demo](https://stackblitz.com/edit/angular-fbarcl)

# Install

```
npm install ngx-image2dataurl --save
```

# Usage

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ImageToDataUrlModule } from "ngx-image2dataurl";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ImageToDataUrlModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```typescript
import { Component } from '@angular/core';
import { Options, ImageResult } from "ngx-image2dataurl";

@Component({
  selector: 'app-root',
  template: `
    <img [src]="src" *ngIf="src"><br>
    <input type="file" [imageToDataUrl]="options"
      (imageSelected)="selected($event)">
  `
})
export class AppComponent {
  src: string = null;
  options: Options = {
    resize: {
      maxHeight: 128,
      maxWidth: 128
    },
    allowedExtensions: ['JPG', 'PnG']
  };

  selected(imageResult: ImageResult) {
    if (imageResult.error) alert(imageResult.error);
    this.src = imageResult.resized
      && imageResult.resized.dataURL
      || imageResult.dataURL;
  }
}
```
# API
## selector: `input[type=file][imageToDataUrl]`

## event: `(imageSelected)`
event fired (async) when the file input changes and the image's `dataURL` is calculated and the image is resized.

```typescript
export interface ImageResult {
  file: File;
  url: string;
  dataURL?: string;
  error?: any;
  resized?: {
      dataURL: string;
      type: string;
  }
}
```

If any error happens, the `error` field is set with an error message.
(e.g. `'Extension Not Allowed'` or `'Image processing error'`)
If the error happens during resizing, `file`, `url` (`objectURL`) of the original image is still set.

## property: `[imageToDataUrl]` - options

```typescript
export interface ResizeOptions {
  maxHeight?: number;
  maxWidth?: number;
  quality?: number;
  type?: string;
}

export interface Options {
  resize?: ResizeOptions;
  allowedExtensions?: string[];
}
```
 - `resize`: default `undefined`
 - `resize.maxHeight`
 - `resize.maxWidth`
 - `resize.quality`: default: `0.7`
 - `resize.type`: default: as the original image
 - `allowedExtensions`: default: undefined

Resize algorithm ensures, that the resized image can fit into the specified `resize.maxHeight x resize.maxWidth` size.

Allowed extensions array (e.g. `['jpg', 'jpeg', 'png']`; case insensitive): if specified and an input file
has different extension the `(imageSelected)` event is fired with the error field set to 'Extension Not Allowed'.
`dataURL` and `resize` not calculated at all.

## Multi-Injector `IMAGE_FILE_PROCESSOR` as `ImageFileProcessor`

```typescript
interface ImageFileProcessor {
  process(dateURL: string): Promise<string>;
}
```

This interface allows to plugin-in any image processing logic which works on the opened file's `dataURL` and should return a promise of the processed image's `dataURL`. You can provide multiple image processors which are changed: ones input is the output of the previous processor.

The initial idea of this feature comes from a request and PR to support automatic EXIF rotation of images. Since I didn't want to package any EXIF processing dependency with this library, I decided to let the users plug-in their own solution. See an old [PR](https://github.com/ribizli/ng2-imageupload/pull/25) from the legacy repo to get some idea how to handle.

#### There are two utility function you can use:

#### `createImageFromDataUrl(dataURL: string): Promise<HTMLImageElement>`: creates an image from `dataURL` which can be used to draw into a canvas.

#### `getImageTypeFromDataUrl(dataURL): Promise<HTMLImageElement>`: determines the MIME type of the image represented by the `dataURL`. Can be used in `Canvas.toDataURL(type)` method.


### Example

``` typescript
// define the processor in the providers section
providers: [
  {
    provide: IMAGE_FILE_PROCESSOR,
    useClass: RotateImageFileProcessor,
    multi: true
  }
]

import { 
  createImageFromDataUrl, getImageTypeFromDataUrl, ImageFileProcessor
} from "ngx-image2dataurl";

// the processor
export class RotateImageFileProcessor implements ImageFileProcessor {
  async process(dataURL: string): Promise<string> {
    const canvas = document.createElement('canvas');
    const image = await createImageFromDataUrl(dataURL);
    canvas.width = image.height;
    canvas.height = image.width;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
    return canvas.toDataURL(getImageTypeFromDataUrl(dataURL));
  }
}
```
