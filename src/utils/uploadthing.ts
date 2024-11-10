import { OurFileRouter } from "@/app/api/core";
import {
    generateUploadButton,
    generateUploadDropzone,
    generateReactHelpers,
  } from "@uploadthing/react";

  
  export const UploadButton = generateUploadButton<OurFileRouter>();
  export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
  export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
  