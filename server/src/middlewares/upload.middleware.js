
import multer from "multer";
import path from "path";

const generateUniqueFilename = (file) => {
    const fileExt = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    return uniqueSuffix + fileExt;
};

var storage = multer.diskStorage({
    destination: "./../uploads",
    filename: (req, file, cb) => {
        cb(null, generateUniqueFilename(file));
    }
})

export const upload = multer({
    storage,
});