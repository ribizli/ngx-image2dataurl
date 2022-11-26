import { Directive, EventEmitter, HostListener, Inject, InjectionToken, Input, OnChanges, Optional, Output } from '@angular/core';
import { ImageFileProcessor, ImageResult, Options, ResizeOptions } from './interfaces';
import { fileToDataURL, getImageTypeFromDataUrl, resizeImage } from './utils';

export const IMAGE_FILE_PROCESSOR = new InjectionToken<ImageFileProcessor>('ImageFileProcessor');

@Directive({
  selector: 'input[type=file][imageToDataUrl]',
  standalone: true,
})
export class ImageToDataUrlDirective implements OnChanges {
  @Output() imageSelected = new EventEmitter<ImageResult>();

  @Input('imageToDataUrl') options: Options = {};

  constructor(
    @Optional()
    @Inject(IMAGE_FILE_PROCESSOR)
    private imageFileProcessors: ImageFileProcessor[]
  ) {
    this.imageFileProcessors = imageFileProcessors || [];
  }

  ngOnChanges() {
    if (!this.options) {
      this.options = {};
    }

    if (this.options.allowedExtensions) {
      this.options.allowedExtensions = this.options.allowedExtensions.map((ext) => ext.toLowerCase());
    }
  }

  @HostListener('change', ['$event'])
  async readFiles(event: Event) {
    for (let file of Array.from((event.target as HTMLInputElement).files)) {
      const result: ImageResult = {
        file,
        url: URL.createObjectURL(file),
      };
      let ext: string = file.name.split('.').pop();
      ext = ext && ext.toLowerCase();
      if (
        ext &&
        this.options.allowedExtensions &&
        this.options.allowedExtensions.length &&
        this.options.allowedExtensions.indexOf(ext) === -1
      ) {
        result.error = new Error('Extension Not Allowed');
      } else {
        try {
          result.dataURL = await fileToDataURL(file);
          for (const processor of this.imageFileProcessors) {
            result.dataURL = await processor.process(result.dataURL);
          }
          result.resized = await this.resize(result.dataURL, this.options.resize);
        } catch (e) {
          result.error = e;
        }
      }
      this.imageSelected.emit(result);
    }
  }

  private async resize(dataURL: string, options: ResizeOptions): Promise<{ dataURL: string; type: string }> {
    if (!options) return null;
    const resisedDataUrl = await resizeImage(dataURL, options);
    return {
      dataURL: resisedDataUrl,
      type: getImageTypeFromDataUrl(resisedDataUrl),
    };
  }
}
