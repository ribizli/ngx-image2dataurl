import { NgModule } from '@angular/core';
import { ImageToDataUrlDirective } from './image-to-data-url.directive';

@NgModule({
  declarations: [ImageToDataUrlDirective],
  exports: [ImageToDataUrlDirective]
})
export class ImageToDataUrlModule { }
