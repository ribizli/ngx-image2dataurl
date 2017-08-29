import { Component } from '@angular/core';
import { ResizeOptions, ImageResult } from "./module/image-to-data-url";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  src: string = null;
  resizeOptions: ResizeOptions = {
      resizeMaxHeight: 128,
      resizeMaxWidth: 128
  };

  selected(imageResult: ImageResult) {
      this.src = imageResult.resized
          && imageResult.resized.dataURL
          || imageResult.dataURL;
  }
}
