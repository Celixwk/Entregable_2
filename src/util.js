import multer from "multer";

import path from 'path';
import { fileURLToPath } from 'url';

const storage = multer.diskStorage({    
   destination: (req, file, cb)=>{ cb(null,'public/img') },        
   filename: (req, file, cb)=>{ cb(null, file.originalname)},
});

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const uploader = multer({storage});
