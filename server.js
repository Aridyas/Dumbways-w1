import express from "express";
import { engine } from "express-handlebars";
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "process";
import multer from 'multer';
import cookieParser from "cookie-parser";
dotenv.config();

const upload = multer({
  dest: "uploads/"
});

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
}).$extends(withAccelerate());

const app = express();

app.engine(".hbs", engine({ extname: ".hbs", defaultLayout: false }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

function Auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userName = decoded.name;
    next();
  } catch {
    res.redirect("/login");
  }
};

app.get('/', (req, res) => {
  res.redirect('/register')
});

app.get('/register', (req, res) => {
  res.render("register")
});

app.get('/login', (req, res) => {
  res.render("login")
});

app.get('/home', Auth, async (req, res) => {
  const projects = await prisma.userProject.findMany({
    include: {
      user: {
        select: {
          name: true
        }
      },
      projectTechs: {
        include: {
          techs: true
        }
      }
    }
  });
  
  const formattedProjects = projects.map(project => ({
    ...project,
    techs: project.projectTechs.map(t => t.techs.value),
    startFormatted: project.dateStart.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }),
    endFormatted: project.dateEnd.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    })
  }));
  
  res.render("home", {projects: formattedProjects, name: req.userName})
});

app.get('/add', (req, res) => {
  res.render("addProject")
});

app.post('/add', Auth, upload.single('image'), async (req, res) => {
  const add = await prisma.userProject.create({
    data: {
      name: req.body.name,
      dateStart: new Date(req.body.dateStart),
      dateEnd: new Date(req.body.dateEnd),
      image: req.file ? "/uploads/" + req.file.filename : null,
      desc: req.body.desc,
      user: {
        connect: { id: req.userId }
      }
    }
  });

  const techValues = Array.isArray(req.body.techs)
                ? req.body.techs
                : [req.body.techs]

  const techs = await prisma.techs.findMany({
    where: {
      value: { in: techValues }
    }
  });

  await prisma.projectTechs.createMany({
    data: techs.map(t => ({
      projectId: add.id,
      techId: t.id

    }))
  })

  res.redirect('/home')

});

//regis
app.post('/user/register', async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  });

  res.redirect('/login')
})

//login
app.post('/user/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: { email: email },
  });

  if (!user) return res.status(401).send("User not found");

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(401).send("Wrong password");

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
  });
  
  res.redirect('/add')
});

app.get('/project/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(404).send("Invalid project id");
  };

  try {
    const project = await prisma.userProject.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).send("Project not found");
    };

    const formattedProject = {
      ...project,
    startFormatted: project.dateStart.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }),
    endFormatted: project.dateEnd.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    }

    res.render('projectDetail', { project: formattedProject })
  } catch(err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }

});

app.get('/account/:name', Auth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId }
  })

  const projects = await prisma.userProject.findMany({
    where: {
      userId: req.userId
    },
    include: {
      user: {
        select: {
          name: true
        }
      },
      projectTechs: {
        include: {
          techs: true
        }
      }
    }
  });
  
  const formattedProjects = projects.map(project => ({
    ...project,
    techs: project.projectTechs.map(t => t.techs.value),
    startFormatted: project.dateStart.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }),
    endFormatted: project.dateEnd.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    })
  }));

  res.render('account', {projects: formattedProjects, account: user})
})

app.post('/project/delete/:id', Auth, async (req, res) => {
  const id = Number(req.params.id);

  await prisma.projectTechs.deleteMany({
    where: { projectId: id }
  });

  await prisma.userProject.delete({
    where: { id }
  })

  res.redirect('/account/:name')
})

app.post('/project/edit/:id', Auth, async (req, res) => {
  const id = Number(req.params.id);

  await prisma.userProject.update({
    where: { id },
    data: {
      name: req.body.name,
      dateStart: new Date(req.body.dateStart),
      dateEnd: new Date(req.body.dateEnd),
      desc: req.body.desc
    }
  })

  res.redirect('/account/:name')
})

const PORT = 4000
app.listen(PORT, () => console.log(`started at port ${PORT}`))