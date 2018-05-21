import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ImageToDataUrlModule } from 'ngx-image2dataurl';

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
