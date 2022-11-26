import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ImageResult, ImageToDataUrlDirective, IMAGE_FILE_PROCESSOR, Options } from 'ngx-image2dataurl';
import { RotateImageFileProcessor } from './rotate-image-file-processor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ImageToDataUrlDirective, NgIf],
  providers: [
    {
      provide: IMAGE_FILE_PROCESSOR,
      useClass: RotateImageFileProcessor,
      multi: true,
    },
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  src: string = null;
  options: Options = {
    resize: {
      maxHeight: 128,
      maxWidth: 128,
    },
    allowedExtensions: ['JPG', 'PnG'],
  };

  selected(imageResult: ImageResult) {
    if (imageResult.error) alert(imageResult.error);
    this.src = (imageResult.resized && imageResult.resized.dataURL) || imageResult.dataURL;
  }
}
