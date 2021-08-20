const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'cont') {
      cb(null, 'public/pdf/')
    } else if (file.fieldname === 'contHeb') {
      cb(null, 'public/pdfHeb/')
    } else if (file.fieldname === 'recs') {
      cb(null, 'public/records/')
    } else if (file.fieldname === 'dedicationsRec') {
      cb(null, 'public/dedicationsRec/')
    } else if (file.fieldname === 'contMobile') {
      cb(null, 'public/pdfMobile/')
    } else if (file.fieldname === 'contHebMobile') {
      cb(null, 'public/pdfHebMobile/')
    } else if (file.fieldname === 'yearSichos') {
      cb(null, 'public/yearSichos/')
    } else if (file.fieldname === 'topicCont') {
      cb(null, 'public/topics/pdf/')
    } else if (file.fieldname === 'topicContHeb') {
      cb(null, 'public/topics/pdfHeb/')
    } else if (file.fieldname === 'topicContEng') {
      cb(null, 'public/topics/pdfEng/')
    }  else if (file.fieldname === 'topicContMobile') {
      cb(null, 'public/topics/pdfMobile/')
    } else if (file.fieldname === 'topicContHebMobile') {
      cb(null, 'public/topics/pdfHebMobile/')
    } else if (file.fieldname === 'topicContEngMobile') {
      cb(null, 'public/topics/pdfEngMobile/')
    }else if (file.fieldname === 'topicRecs') {
      cb(null, 'public/topics/records/')
    }
  },
  filename: function (req, file, cb) {
    console.log(file, file.originalname);
    cb(null, file.originalname)
  }
})

const limits = {
  fieldSize: 25 * 1024 * 1024,
}

const upload = multer({ storage, limits }).any();

function uploadFile(req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.json(err)
    } else if (err) {
      // An unknown error occurred when uploading.
    }
    // Everything went fine. 
    next()

  })
}

module.exports = uploadFile;