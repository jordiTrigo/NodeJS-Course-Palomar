const mongoose = require('mongoose');
const express = require('express');
const UserModel = require('../models/user');
const router = express.Router();
/* Paquet express-validator: 
   https://express-validator.github.io/docs/index.html
   https://github.com/validatorjs/validator.js#validators
   https://www.freecodecamp.org/news/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7/ */

const { body, validationResult } = require('express-validator');

// Mostrar la llista d'usuaris guardats 

router.get('/', async(req, res) => {
    const userList = await UserModel.find();
    res.send(userList);
})

router.get('/:id', async(req, res) => {
    const myUser = await UserModel.findById(req.params.id);

    if (!myUser) return res.status(404).send('No hem trobat un usuari amb aquest ID: ' + req.params.id);

    res.send(myUser);
})

/* Mètode POST */

/* POST amb express-validator. En el cas de POST els paràmetres els estem passant a 
   través del BODY, no de l'url. Per això utilitzem:
   req.body.myName, 
   req.body.myIsCostumer, 
   req.body.myEmail */

router.post('/', [
        // myName must be at least 1 chars long
        body('myName').isLength({ min: 1 }),    
        // myEmail must be an email
        body('myEmail').isEmail()
    ], async(req, res) => {    

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      /* Si passa per aquest return, surt de la funció */

      return res.status(400).json({ errors: errors.array() });
    };
    
    /* Creem l'usuari */

    const myUser = new UserModel({
        name: req.body.myName,
        isCostumer: req.body.myIsCostumer,
        email: req.body.myEmail
    });    

    /* Guardem a la base de dades mongodb */
       
    const result = await myUser.save();

    /* Codi d'estat 201 és el de CREATED */

    res.status(201).send(result);
});

/* PUT amb express-validator. Canviem l'endpoint a /:myId. En el cas de PUT
   els paràmetres els estem passant a través de l'URL, no del BODY. Per això utilitzem
   req.params.myId */

router.put('/:myId', [
        // myName must be at least 2 chars long
        body('myName').isLength({ min: 2 }),    
        // myEmail must be an email
        body('myEmail').isEmail()
    ], async(req, res) => {    

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      /* Si passa per aquest return, surt de la funció */

      return res.status(400).json({ errors: errors.array() });
    };
    
    // Cerquem l'usuari a la nostra bbdd MongoDB. El paràmetre req.params.myId està a l'url.

    const myUserById = await UserModel.findByIdAndUpdate(req.params.myId, {
        name: req.body.myName,
        isCostumer: req.body.myIsCostumer,
        email: req.body.myEmail
    },
    {
        new: true
    });

    /* Si !myUserById is TRUE, vol dir que l'objecte és NULL i per tant no l'ha trobat i no s'ha
       de processar. El return de dins de la funció fa que l'execució surti. */

    if (!myUserById){
        return res.status(404).send('The user with ID ' + req.params.myId + ' does not exists!');
    }
    
    /* Codi d'estat 204 és el de: The Server successfully processed the request, 
       but is not returning any content. */

    res.status(204).send('The user has been updated successfully.');
});

/* DELETE */

router.delete('/:myId', async(req, res) => {    

    const myUser = await UserModel.findByIdAndDelete(req.params.myId);

    if (!myUser){
        return res.status(404).send('The user with ID ' + req.params.myId + ' does not exists! So we can not delete it!!');    
    };    

    res.status(200).send('The user has been deleted successfully.');
})

module.exports = router;