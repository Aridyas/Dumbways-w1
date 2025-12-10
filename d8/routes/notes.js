const express = require("express");
const router = express.Router();

const noteController = require("../controllers/notes.controller");

router.get("/", noteController.getAllNotes);
router.post("/", noteController.createNote);

module.exports = router;