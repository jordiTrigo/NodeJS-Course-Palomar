function myDate(req, res, next) {
    console.log('Time: ', Date.now());

    // Important: Hem de posar next() pq sinó (comentant el code next es pot comprovar), 
    // el procés s'atura aquí i no continua.
    
    next();
};

module.exports = myDate;