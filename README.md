# ngx-image2dataurl
An Angular component which resizes the selected input file image

# Install

```
npm install ngx-image2dataurl --save
```

# Usage

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ImageToDataUrlModule } from "./module/image-to-data-url";

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
import { Options, ImageResult } from "./module/image-to-data-url";

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
If the error happens during resizing, `file`, `url` and `dataURL` of the original image is still set.

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
 - `resize.type`: default: `image/jpeg`
 - `allowedExtensions`: default: undefined

Resize algorithm ensures, that the resized image can fit into the specified `resize.maxHeight x resize.maxWidth` size.

Allowed extensions array (e.g. `['jpg', 'jpeg', 'png']`; case insensitive): if specified and an input file
has different extension the `imageSelected` event is fired with the error field set to 'Extension Not Allowed'.
`dataUrl` and `resize` not calculated at all.
