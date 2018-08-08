import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ImageToDataUrlModule, IMAGE_FILE_PROCESSOR } from 'ngx-image2dataurl';
import { AppComponent } from './app.component';
import { RotateImageFileProcessor } from './rotate-image-file-processor';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ImageToDataUrlModule
  ],
  providers: [
    {
      provide: IMAGE_FILE_PROCESSOR, useClass: RotateImageFileProcessor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
