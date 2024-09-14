const { auto_update } = require('./splatoon/info_rotations')
const { get_paths_images, get_path_by_name, get_now_image_by_name } = require('./splatoon/get')



//auto_update()

const express = require('express')
const app = express()
const port = 50000
const nowRouter = express.Router();


const path = '/splatoon/img_rotations/'


app.get('/', (req, res) => {
    const htmlContent = `
    <style>
    body {
        font-family: Arial, sans-serif;
        margin: 2em;
        }
    </style>
    <h1>Here are some useful links:</h1>
    <ul>
      <li><a href="http://192.168.1.116:50000/now/turf">Turf</a></li>
      <li><a href="http://192.168.1.116:50000/now/serie">Serie</a></li>
      <li><a href="http://192.168.1.116:50000/now/open">Open</a></li>
      <li><a href="http://192.168.1.116:50000/now/x">X</a></li>
      <li><a href="http://192.168.1.116:50000/now/challenge">Challenge</a></li>
      <li><a href="http://192.168.1.116:50000/now/coop">Salmon Run</a></li>
      </ul>
  `;
  res.send(htmlContent);
});


// Middleware spécifique à /now et à toutes ses routes enfants
nowRouter.use((req, res, next) => {

    next();
  });


//Get images by type ------------------------------------------------

nowRouter.get('/turf', (req, res) => {
    get_now_image_by_name('regular').then(path => {
        res.sendFile(__dirname + '/' + path)
    })
});

nowRouter.get('/open', (req, res) => {
    get_now_image_by_name('Ouvert').then(path => {
        res.sendFile(__dirname + '/' + path)
    })
});

nowRouter.get('/serie', (req, res) => {
    get_now_image_by_name('Série').then(path => {
        res.sendFile(__dirname + '/' + path)
    })
});

nowRouter.get('/x', (req, res) => {
    get_now_image_by_name('x').then(path => {
        res.sendFile(__dirname + '/' + path)
    })
});

nowRouter.get('/challenge', (req, res) => {
    get_now_image_by_name('event').then(path => {
        res.sendFile(__dirname + '/' + path)
    })
});

nowRouter.get('/coop', (req, res) => {
    get_now_image_by_name('coop').then(path => {
        res.sendFile(__dirname + '/' + path)
    })
});



//Ajout des routeurs --------------------------------------------------------

// Attacher le routeur à la route principale /now
app.use('/now', nowRouter);


app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`)
});