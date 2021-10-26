import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid';
import config from '.';

const storage = multer.diskStorage({
  destination: path.join(__dirname, config.get('tmp')),
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
})

export default storage
