exports.getAllUsers = (req, res) => {
    res.json({ message: "Users endpoint works!" });
};

exports.createUser = (req, res) => {
    const { title, name, value } = req.body;


    res.json({
        message: "User created!",
        title,
        name,
        value
    });
};