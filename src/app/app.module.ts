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
