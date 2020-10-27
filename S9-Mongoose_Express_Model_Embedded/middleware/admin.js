function isAdmin(req, res, next){
    if(!req.user.isAdmin) return res.status(403).send('Accés denegat!');
    next();
};

module.exports = isAdmin;