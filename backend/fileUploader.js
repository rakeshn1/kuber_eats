const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const uniqueFileName = file.originalname.substring(0,file.originalname.length -4)+'_'+uniqueSuffix+file.originalname.slice(-4)
        console.log(uniqueFileName)
        cb(null, uniqueFileName)
    }
})
const upload = multer({ storage: storage })

module.exports = upload;