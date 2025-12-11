import express from 'express';
import { engine } from 'express-handlebars';
import { extname } from 'path';
import multer from 'multer';

const app = express();

app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });
app.use('/uploads', express.static("uploads"));


app.engine('hbs', engine({ 
    extname: '.hbs',
    defaultLayout: false
 }));
app.set('view engine', 'hbs');
app.set('views', './views')

//css
app.use(express.static("public"));

//projects mapping
let projects = [];

app.post("/projects/add", upload.single("image"), (req, res) => {
  projects.push({
    id: Date.now(),
    name: req.body.name,
    start: req.body.start,
    end: req.body.end,
    techs: Array.isArray(req.body.techs)
        ? req.body.techs
        : [req.body.techs].filter(Boolean),
    image: req.file ? "/uploads/" + req.file.filename : null,
    desc: req.body.desc
  });
4
  res.redirect('/');

});

app.get("/", (req, res) => {
  res.render("main", { projects });
});

app.listen("2000");