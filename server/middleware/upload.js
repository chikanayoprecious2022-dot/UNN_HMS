import multer from 'multer';

// Memory storage allows receiving the file safely and uploading to Cloudinary
// without crashing the request if Cloudinary has network timeouts or errors.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export default upload;
