const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'cont') {
      cb(null, 'public/pdf/')
    } else if (file.fieldname === 'contHeb') {
      cb(null, 'public/pdfHeb/')
    } else if (file.fieldname === 'recs') {
      cb(null, 'public/records/')
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage });

module.exports = upload;