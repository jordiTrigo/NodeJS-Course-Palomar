const jwt = require('jsonwebtoken');

function verifyAuth(req, res, next){
    const jwtToken = req.header('Authorization');

    if(!jwtToken) return res.status(401).send('Accés denegat. Has d\'enviar un token vàlid!');

    try{
        //const mySecret = '3lM31S3cr3tP3rCr34r1nJwtT0k3n';
        //const payload = jwt.verify(jwtToken, mySecret);
        //req.user = payload;

        // Utilitzem una variable d'entorn que està guardada al fitxer .env 
        const payload = jwt.verify(jwtToken, process.env.SECRET_KEY_JWT_CAR_API);
        req.user = payload;
        next();
    }catch(e){
        return res.status(400).send('Accés denegat. El token no és vàlid!')
    };    
};

module.exports = verifyAuth;