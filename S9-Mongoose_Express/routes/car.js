const mongoose = require('mongoose');
const express = require('express');
const CarModel = require('../models/cars');
const router = express.Router();
/* Paquet express-validator: 
   https://express-validator.github.io/docs/index.html
   https://github.com/validatorjs/validator.js#validators
   https://www.freecodecamp.org/news/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7/ */

const { body, validationResult } = require('express-validator');

// Mètode GET

// Versió 1:
// Mostrar la llista de cotxes guardats a la bbdd 
/*
router.get('/', async(req, res) => {
    const carList = await CarModel.find();
    res.send(carList);
})

router.get('/:id', async(req, res) => {
    const myCar = await CarModel.findById(req.params.id);

    if (!myCar) return res.status(404).send('No hem trobat un cotxe amb aquest ID: ' + req.params.id);

    res.send(myCar);
})
*/

// Versió 2: Dades normalitzades. Al camp company de la collection carcollection tenim guardat 
// l'ObjectId de la collection companycollection, ie, la pk forània. Aleshores, per recuperar
// la info de company associada al cotxe hem de fer un "join" per anar a cercar les seves dades. 
// Per això utilitzem el mètode populate('nom_del_camp_vincle', 'llista_camps_a_mostrar_separats_per_espai') ...
// Mostrar la llista de cotxes guardats a la bbdd 

router.get('/', async(req, res) => {
/*    
    const carList = await CarModel
                        .find()
                        .populate('company'); // en aquest cas el camp company que pertany a la
                                              // collection carcollection farà vincle amb la 
                                              // collection companycollection de MongoDB i portarà
                                              // les seves dades. Mirar també que a l'Schema definit
                                              // a /models/car tenim una ref definida que ens permet
                                              // fer aquest vincle ...                                              
    res.send(carList);
*/    

const carList = await CarModel
                    .find()
                    .populate('company', 'name country'); 
                                          // en aquest cas el camp company que pertany a la
                                          // collection carcollection farà vincle amb la 
                                          // collection companycollection de MongoDB i portarà
                                          // les seves dades. Mirar també que a l'Schema definit
                                          // a /models/car tenim una ref definida que ens permet
                                          // fer aquest vincle ...                                              
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

/* Versió 1:
router.post('/', [
    // myCompany must be at least 3 chars long
    body('myCompany').isLength({ min: 3 }),
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
    
    // Creem el cotxe 

    const myCar = new CarModel({
        company: req.body.myCompany,
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
*/

// Versió 2: Dades normalitzades. Al camp company guardem l'ObjectId de la collection companycollection ...
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
    
    // Creem el cotxe 

    const myCar = new CarModel({
        company: req.body.myCompany,
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

// Versió 1:

/*
// PUT amb express-validator. Canviem l'endpoint a /:myId. En el cas de PUT
// els paràmetres els estem passant a través de l'URL, no del BODY. Per això utilitzem
// req.params.myId 

router.put('/:myId', [
    // myCompany must be at least 3 chars long
    body('myCompany').isLength({ min: 3 }),
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
    
    // Cerquem el cotxe a la nostra bbdd MongoDB. El paràmetre req.params.myId està a l'url.

    const myCarById = await CarModel.findByIdAndUpdate(req.params.myId, {
        company: req.body.myCompany,
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
    //   de processar. El return de dins de la funció fa que l'execució surti. 

    if (!myCarById){
        return res.status(404).send('The car with ID ' + req.params.myId + ' does not exists!');
    }
    
    // Codi d'estat 204 és el de: The Server successfully processed the request, 
    // but is not returning any content. 

    res.status(204).send('The car has been updated successfully.');
});
*/

// Versió 2: Dades normalitzades. Al camp company guardem l'ObjectId de la collection companycollection ...

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
    
    // Cerquem el cotxe a la nostra bbdd MongoDB. El paràmetre req.params.myId està a l'url.

    const myCarById = await CarModel.findByIdAndUpdate(req.params.myId, {
        company: req.body.myCompany,
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
    }
    
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