// express
const express = require('express');
const app = express();
// csv to json
const csv = require('csvtojson');
// fs
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const upload = multer({
    dest: 'public/tmp',
});
// path
const path = require('path');
// port
const port = process.env.PORT || 3000;
// handlebars
const hbs = require('hbs')
// view engine
app.set('view engine', 'hbs');
// views
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('csvFile'), (req, res) => {
    const title = req.file.filename;
    const file = req.file;
    console.log(file);
    const csvFilePath = file.path;
    if (file.size > 1000000) {
        res.send('File is too large. 1MB limit.');
    }
    if (file.mimetype !== 'text/csv') {
        res.send('File is not a CSV.');
    }

    res.redirect(`/table/${title}`);

});


app.get('/table/:id', (req, res) => {
    const csvFilePath = path.join(__dirname, 'public', 'tmp', `${req.params.id}`);
    convertCSVtoJSON(csvFilePath).then((data) => {
        res.render('table2', { data: encodeURIComponent(JSON.stringify(data)) });
    }).catch((err) => {
        console.log(err);
    });
}
);


// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// }
// );
// list on port on host 0.0.0.0
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
}
);

async function convertCSVtoJSON(csvFilePath) {
    const jsonArray = await csv().fromFile(csvFilePath);
    return jsonArray;
}