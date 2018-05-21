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
