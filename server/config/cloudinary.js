const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Avatar storage
const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'devlytic/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'fill' }],
    },
});

// Resume storage
const resumeStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'devlytic/resumes',
        allowed_formats: ['pdf'],
        resource_type: 'raw',
    },
});

// Logo storage
const logoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'devlytic/logos',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'fill' }],
    },
});

const uploadAvatar = multer({ storage: avatarStorage });
const uploadResume = multer({ storage: resumeStorage });
const uploadLogo = multer({ storage: logoStorage });

module.exports = { cloudinary, uploadAvatar, uploadResume, uploadLogo };