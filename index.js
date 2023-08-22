var express = require("express");
var morgan = require("morgan");
var path = require("path");
var fileupload = require("express-fileupload");

var { networkInterfaces } = require('os');

var app = express();

app.use(morgan("short"));
app.use(fileupload());

var staticPath = path.join(__dirname, "files");
app.use(express.static(staticPath));

var nets = networkInterfaces()
var results = Object.create(null);

for(const name of Object.keys(nets)) {
  for (const net of nets[name]){
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    if (net.family === 'IPv4' && !net.internal) {
      if (!results[name]) {
          results[name] = [];
        }
      results[name].push(net.address);
    }
  }
}

// console.log(results)

app.listen(3000, function() {
	console.log(`App started on localhost:3000`);
})

app.get('/', function (req, res) {

  res.write(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Document</title></head>
  <body>
    SERVER
    <form enctype="multipart/form-data" method="post">
      <p>
        <input type="file" name="photo" />
        <input id="submit" type="submit" value="Send" />
      </p>`);
  res.write(`<pre id="result">`);

  // filesInFolder.forEach((file) => {
  //   res.write(`<a href="./files/${file}">${file}</a><br><br>`);
  // });

  res.write(`</pre>`);
  res.write(`</form></body></html>`);
  res.end();m
});

app.post('/', async (req, res) => {
	console.log(req.files);
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded',
      });
    } else {

      let photo = req.files.photo;


      photo
        .mv(__dirname + '\\' + 'files\\' + photo.name)
        .then(
          console.log(`
        status: true,
        message: 'File is uploaded',
        data: {
          name: ${photo.name},
          mimetype: ${photo.mimetype},
          size: ${photo.size},
        `)
        )
        .then((filesInFolder = fs.readdirSync(__dirname + '/files')))
        .then(
          filesInFolder.forEach((file) => {
            app.get(`/files/${file}`, function (req, res) {
              res.sendFile(__dirname + `/files/${file}`);
            });
          })
        )
        .then(res.redirect('back'));

      // console.log($.html())
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.use(function(req, res){
	res.status(404);
	res.send("File not found!");
})