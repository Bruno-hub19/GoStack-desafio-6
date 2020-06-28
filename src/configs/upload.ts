import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const filePath = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: filePath,

  storage: multer.diskStorage({
    destination: filePath,
    filename(request, file, callback) {
      const hashedFileName = crypto.randomBytes(10).toString('HEX');
      const fileName = `${hashedFileName}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
