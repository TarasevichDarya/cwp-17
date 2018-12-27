# CWP/TASK/17 - Загрузка файлов
function task00() {

Создаем на Github репозиторий cwp-17, клонируем его, открываем в IDE

Установим библиотеки express, multer, uuid и sharp

}

function task01() {

Создадим скрипт index.js и реализуем в нем простой HTTP-сервер позволяющий загружать файлы на сервер:

const express = require('express');

const multer  = require('multer');


const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const app = express();

app.post('/upload', upload.single('file'), (req, res, next) => {

  res.json({ succeed: true });

});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

Создадим форму в файле form.html для того, чтобы отправлять файлы из браузера:

<form action="http://localhost:3000/upload" method="POST" enctype="multipart/form-data">

  <input name="file" type="file">

  <input type="submit">

</form>

Запустим сервер и форму. Попробуем загрузить на него файл

Изменим сервер, чтобы форма раздавалась напрямую с сервера с помощью express.static

}

function task02() {

Создадим обработчик для POST /pdf

1. Должен загружать только PDF файлы. Проверка должна быть на сервере

2. Файлы сохраняются в папку /uploads/pdf

3. Имя файла генерируется случайно с помощью uuid/v4 (не забываем про расширение)

4. Позволяет загрузить одновременно до 3 файлов. Форма которая может отправлять несколько файлов:

<form action="http://localhost:3000/pdf" method="POST" enctype="multipart/form-data">

  <input name="files" type="file" multiple>

  <input type="submit">

</form>

5. Возвращает массив сгенерированных имен загруженных файлов в формате json

}

function task03() {

Создадим обработчик для POST /images

1. Должен загружать только PNG и JPG файлы. Проверка должна быть на сервере

2. Файлы сохраняются в папку /uploads/images

3. Имя файла генерируется случайно с помощью uuid/v4 (не забываем про расширение). К имени добавляется суффикс master.

Т.е. имя будет выглядеть так 110ec58a-a0f2-4ac4-8393-c866d813b8d1-master.png

4. Позволяет загрузить одновременно только один файл

5. Создает дополнительно 2 файла с суффиксами preview (максимальный размер 800х600) и thumbnail (максимальный размер 300х180). Масштабирование делается с помощью библиотеки sharp

6. Возвращает массив сгенерированных имен файлов в формате json

7. Раздача картинок с помощью express.static

8*. Для картинок периписать загрузку через MemoryStorage с последующим сохранением файлов на диск

9*. Дополнительная валидация расширения файлов на стороне клиента (в форме)

Задания со звездочкой предназначены для персонального роста и необязательны к показу при защите лабораторной работы

}

function task04() {

Синхронизируем локальный репозиторий с удаленным (сделаем push на Github)

}