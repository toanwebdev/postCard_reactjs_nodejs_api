import express from 'express'
import multer from 'multer'
import uploadFileController from '../controllers/uploadFileController'
import path from 'path'
import appRoot from 'app-root-path'

const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, appRoot + '/../client/public/images')
	},

	// By default, multer removes file extensions so let's add them back
	filename: function (_req, file, cb) {
		const { name, ext } = path.parse(file.originalname)
		cb(null, name + '-' + Date.now() + ext)
	},
})

const imageFilter = function (req: any, file: any, cb: any) {
	// Accept images only
	if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
		req.fileValidationError = 'Only image files are allowed!'
		return cb(new Error('Only image files are allowed!'), false)
	}
	cb(null, true)
}

export const uploadMulter = multer({
	storage: storage,
	fileFilter: imageFilter,
})

const router = express.Router()

router.post(
	'/',
	uploadMulter.array('uploadFile', 50),
	uploadFileController.uploadFile,
)

export default router
