export default function Auth(req, res, next) {
    if (!req.user) {
        return res.redirect('/login');
    }
    next();
}   