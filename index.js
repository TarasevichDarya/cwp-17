const express = require('express');
const multer  = require('multer');//для загрузки
const sharp = require('sharp');//для изм разм
const uuid = require('uuid/v4');//для созд уник имени
const path = require('path');
const Promise = require('bluebird');
const app = express();
const fs = require('fs');

app.use('/uploads', express.static('uploads'));

const upload = multer({
	storage: multer.diskStorage({
		destination: './uploads/',
		filename: (req, file, cb) => {
			cb(null, file.originalname);
		}
	})
});


app.get('/upload', upload.single('file'), (req, res) => {
	res.sendFile('form.html', {root: './public/'});
});

app.post('/upload', upload.single('file'), (req, res) => {
	res.json({succeed: true});
});


//pdf
const pdfUpload = multer({
	storage: multer.diskStorage({ //функция для сохранения на дисковое пространства. Дает полный контроль над размещением файлов на диск.
		destination: './uploads/pdf/',
		filename: (req, file, cb) => {
			cb(null, `${uuid()}${file.ext = path.extname(file.originalname)}`);
		}
	}),
	fileFilter: function fileFilter(req, file, cb) {
		file.mimetype.split('/')[1] === 'pdf' ? cb(null, true) : cb(null, false);
	}
});

app.get('/pdf', upload.single('file'), (req, res) => {
	res.sendFile('pdf.html', {root: './public/'});
});

app.post('/pdf', pdfUpload.array('files', 3), (req, res) => {
	if (req.files.length < 1 || req.files.map((elem) => elem.ext !== '.pdf').indexOf(true) > -1) {
		res.json({
			error: 501,
			message: 'file upload error or wrong extension'
		});
	}
	else {
		console.log(req);
		res.json({
			files: req.files.map((file) => file.filename)
		});
	}
});

//images
const imageUpload = multer({
	storage: multer.memoryStorage(), //Движок оперативной памяти сохраняет файлы в памяти как объекты типа Buffer
	fileFilter: function fileFilter(req, file, cb) {
		file.mimetype.split('/')[0] === 'image' ? cb(null, true) : cb(null, false);
	}
});

app.get('/images', (req, res) => {
	res.sendFile('image.html', {root: './public/'});
});

app.post('/images', imageUpload.single('image'), async (req, res) => {
	let ext = ['.jpg', '.png'];
	if (req.file === undefined)
	{
		res.json({error: 500, message: 'file upload error'});
	}
	else if (ext.indexOf(path.extname(req.file.originalname)) < 0)
	{
		res.json({error: 501, message: 'wrong extension'});
	}
	else
	{
		let extension = path.extname(req.file.originalname);
		let filename = `${uuid()}`;
		let filenames = [ `${filename}-master${extension}`, `${filename}-preview${extension}`, `${filename}-thumbnail${extension}` ];
		Promise.all([
			fs.writeFileSync(`./uploads/images/${filenames[0]}`, req.file.buffer, 'binary'),
			sharp(req.file.buffer).resize(800, 600).toFile(`./uploads/images/${filenames[1]}`),
			sharp(req.file.buffer).resize(300, 180).toFile(`./uploads/images/${filenames[2]}`)
		]).then(() => {
			res.json(filenames);
		}).catch((err) => {
			res.json(err);
		});
	}
});

app.listen(3000, '127.0.0.1', () => console.log('Start server on port 3000!'));








