const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/users");
const userNotes = require("./routes/notes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// routes (FIXED)
app.use("/api/users", userRoutes);
app.use("/api/notes", userNotes);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ error: "internal server error "})
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running at localhost:${PORT}`));
