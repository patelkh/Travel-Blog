const multer = require('multer');

//defines where the file will be uploaded and what will be the file name
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

//if the file type is JPEG, JPG or PPNG then allow file to be saved to storage otherwise reject
// const fileFilter = (req, res, callback) => {
//     if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')){
//         callback(null, true);
//     } else{
//         callback(null, false);
//     }
// }

let upload = multer({ storage: storage});

exports.upload = upload