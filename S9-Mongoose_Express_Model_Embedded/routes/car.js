const mongoose = require('mongoose');
const express = require('express');
const CarModel = require('../models/cars');
const verifyAuth = require('../middleware/auth');
const authorizeRole = require('../middleware/role');
const Role = require('../helpers/role')
const {CompanyModel} = require('../models/company');
const router = express.Router();

/* Paquet express-validator: 
   https://express-validator.github.io/docs/index.html
   https://github.com/validatorjs/validator.js#validators
   https://www.freecodecamp.org/news/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7/ */

const { body, validationResult } = require('express-validator');

// Mètode GET

// Versió: Dades embedded. Al camp company de la collection carcollection tenim guardat 
// tot un subdocument que representa l'objecte company.

// La part [verifyAuth, admin] és la dels middlewares. Per poder accedir al get primer passa pels
// middlewares i ha de complir 
// 1) verifyAuth -> ../middleware/auth.js
// 2) roleType -> ../middleware/role.js (en aquest cas els rols possibles són Admin i Editor, si 
//    li passes User, NO entrarà en el get)

router.get('/', [verifyAuth, authorizeRole([Role.Admin, Role.Editor])], async(req, res) => {
    const carList = await CarModel.find();
    res.send(carList);
});

router.get('/:id', async(req, res) => {
    const myCar = await CarModel.findById(req.params.id);

    if (!myCar) return res.status(404).send('No hem trobat un cotxe amb aquest ID: ' + req.params.id);

    res.send(myCar);
})

// Mètode POST 

/* POST amb express-validator. En el cas de POST els paràmetres els estem passant a través 
   del BODY, no de l'url. Per això utilitzem req.body.myCompany, req.body.myModel, req.body.myYear */

// Versió : Dades embedded. Al camp company guardem un subdocument amb les dades de l'objecte company ...

router.post('/', [
        // myModel must be at least 1 char long
        body('myModel').isLength({ min: 1 }),
        // myModel must be at least 1 char long
        body('myYear').isInt({ min: 2000, max: 3000 } )
    ], async(req, res) => {    

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      // Si passa per aquest return, surt de la funció 

      return res.status(400).json({ errors: errors.array() });
    };
    
    // Cerquem el subdocument Company

    const myCompany = await CompanyModel.findById(req.body.myCompanyId);

    if (!myCompany) return res.status(400).send('Cannot create a new car because does not exists a COMPANY with the ObjectId: ' + req.body.myCompany);

    // Creem el cotxe 

    const myCar = new CarModel({
        company: myCompany,
        model: req.body.myModel,
        year: req.body.myYear,
        sold: req.body.mySold,
        price: req.body.myPrice,
        extras: req.body.myExtras
    });    

    // Guardem a la base de dades mongodb 
       
    const result = await myCar.save();

    // Codi d'estat 201 és el de CREATED 

    res.status(201).send(result);
});

// Mètode PUT

// Versió: Dades embedded. Al camp company guardem l'objecte company ...

// PUT amb express-validator. Canviem l'endpoint a /:myId. En el cas de PUT
// els paràmetres els estem passant a través de l'URL, no del BODY. Per això utilitzem
// req.params.myId 

router.put('/:myId', [    
        // myModel must be at least 1 char long
        body('myModel').isLength({ min: 1 }),
        // myModel must be at least 1 char long
        body('myYear').isInt({ min: 2000, max: 3000 } )
    ], async(req, res) => {    

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      // Si passa per aquest return, surt de la funció 

      return res.status(400).json({ errors: errors.array() });
    };
    
    // Cerquem el subdocument Company

    const myCompany = await CompanyModel.findById(req.body.myCompanyId);

    if (!myCompany) return res.status(400).send('Cannot create a new car because does not exists a COMPANY with the ObjectId: ' + req.body.myCompany);

    // Cerquem el cotxe a la nostra bbdd MongoDB. El paràmetre req.params.myId està a l'url.

    const myCarById = await CarModel.findByIdAndUpdate(req.params.myId, {
        company: myCompany,
        model: req.body.myModel,
        year: req.body.myYear,
        sold: req.body.mySold,
        price: req.body.myPrice,
        extras: req.body.myExtras
    },
    {
        new: true
    })

    // Si !myCarById is TRUE, vol dir que l'objecte és NULL i per tant no l'ha trobat i no s'ha
    // de processar. El return de dins de la funció fa que l'execució surti. 

    if (!myCarById){
        return res.status(404).send('The car with ID ' + req.params.myId + ' does not exists!');
    };
    
    // Codi d'estat 204 és el de: The Server successfully processed the request, 
    // but is not returning any content. 

    res.status(204).send('The car has been updated successfully.');
});

// DELETE 

router.delete('/:myId', async(req, res) => {    

    const myCar = await CarModel.findByIdAndDelete(req.params.myId);

    if (!myCar){
        return res.status(404).send('The car with ID ' + req.params.myId + ' does not exists! So we can not delete it!!');    
    };    

    res.status(200).send('The car has been deleted successfully.');
})

module.exports = router;