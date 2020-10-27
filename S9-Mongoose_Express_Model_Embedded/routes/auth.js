//const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const UserModel = require('../models/user');
const router = express.Router();
/* Paquet express-validator: 
   https://express-validator.github.io/docs/index.html
   https://github.com/validatorjs/validator.js#validators
   https://www.freecodecamp.org/news/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7/ */

const { body, validationResult } = require('express-validator');

router.post('/', [        
        // myEmail must be an email
        body('myEmail').isEmail(),
        // myPassword must be at least 3 chars long
        body('myPassword').isLength({ min: 3 })
    ], async(req, res) => {    

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        // Si passa per aquest return, surt de la funció 

        return res.status(400).json({ errors: errors.array() });
    };

    let myUser = await UserModel.findOne({email: req.body.myEmail});
    if (!myUser) return res.status(400).send('User o password incorrecte!');

    const passwordValid = await bcrypt.compare(req.body.myPassword, myUser.password);
    if (!passwordValid) return res.status(400).send('User o password incorrecte!');
   
    //res.send('Usuari i password correcte!');

    // Utilitzant JWT:
    //const mySecret = '3lM31S3cr3tP3rCr34r1nJwtT0k3n';
    //const jwtToken = jwt.sign({ _id: myUser._id, name: myUser.name}, mySecret);

    // Utilitzant JWT (Versió 2): hem creat una funció a models/user.js que fa aquesta
    // funció de generar el JWT ja que, també teniem el mateix codi a /routes/auth.js i
    // d'aquesta manera centralitzem el codi en un únic punt ... 

    const jwtToken = myUser.generateJWT();    

    res.status(200).header('Authorization', jwtToken).send({_id: myUser.id, name: myUser.name});
});

module.exports = router;