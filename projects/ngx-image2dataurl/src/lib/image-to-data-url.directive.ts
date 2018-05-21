import {
  Directive, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges
} from '@angular/core';

import { ImageResult, Options } from './interfaces';
import { createImage, resizeImage } from './utils';

@Directive({
  selector: 'input[type=file][imageToDataUrl]'
})
export class ImageToDataUrlDirective implements OnChanges {

  @Output() imageSelected = new EventEmitter<ImageResult>();

  @Input('imageToDataUrl') options: Options = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.options) {
      this.options = {};
    }

    if (this.options.allowedExtensions) {
      this.options.allowedExtensions = this.options.allowedExtensions.map(ext => ext.toLowerCase());
    }
  }

  @HostListener('change', ['$event'])
  readFiles(event) {
    for (let file of event.target.files as File[]) {
      const result: ImageResult = {
        file: file,
        url: URL.createObjectURL(file)
      };
      let ext: string = file.name.split('.').pop();
      ext = ext && ext.toLowerCase();
      if (ext && this.options.allowedExtensions
        && this.options.allowedExtensions.length
        && this.options.allowedExtensions.indexOf(ext) === -1) {
        result.error = new Error('Extension Not Allowed');
        this.imageSelected.emit(result);
      } else {
        this.fileToDataURL(file, result).then(r => this.resize(r))
          .catch(e => {
            result.error = e;
            return result;
          }).then(r => this.imageSelected.emit(r));
      }
    }
  }

  private resize(result: ImageResult): Promise<ImageResult> {
    if (!this.options.resize) return Promise.resolve(result);
    return createImage(result.url).then(image => {
      const dataUrl = resizeImage(image, this.options.resize);
      result.resized = {
        dataURL: dataUrl,
        type: dataUrl.match(/:(.+\/.+;)/)[1]
      };
      return result;
    });
  }

  private fileToDataURL(file: File, result: ImageResult): Promise<ImageResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        result.dataURL = reader.result;
        resolve(result);
      };
      reader.readAsDataURL(file);
    });
  }
}


