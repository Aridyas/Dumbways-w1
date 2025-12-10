exports.getAllNotes = (req, res) => {
    res.json({ message: "Notes endpoint works!" });
};

exports.createNote = (req, res) => {
    res.json({ message: "Notes created (fake)!" });
};