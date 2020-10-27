const mongoose = require('mongoose');
const express = require('express');
const {CompanyModel} = require('../models/company');
const router = express.Router();
/* Paquet express-validator: 
   https://express-validator.github.io/docs/index.html
   https://github.com/validatorjs/validator.js#validators
   https://www.freecodecamp.org/news/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7/ */

const { body, validationResult } = require('express-validator');

/* Mostrar la llista de companies guardades a la bbdd */

router.get('/', async(req, res) => {
    const companyList = await CompanyModel.find();
    res.send(companyList);
})

router.get('/:id', async(req, res) => {
    const myCompany = await CompanyModel.findById(req.params.id);

    if (!myCompany) return res.status(404).send('No hem trobat una company amb aquest ID: ' + req.params.id);

    res.send(myCompany);
})

/* Mètode POST */

/* POST amb express-validator. En el cas de POST els paràmetres els estem passant a través 
   del BODY, no de l'url. Per això utilitzem req.body.myCompany, req.body.myModel, req.body.myYear */

router.post('/', async(req, res) => {    
    /* Creem una company */

    const myCompany = new CompanyModel({
        name: req.body.myName,
        country: req.body.myCountry
    });    

    /* Guardem a la base de dades mongodb */
       
    const result = await myCompany.save();

    /* Codi d'estat 201 és el de CREATED */

    res.status(201).send(result);
});

/* PUT amb express-validator. Canviem l'endpoint a /:myId. En el cas de PUT
   els paràmetres els estem passant a través de l'URL, no del BODY. Per això utilitzem
   req.params.myId */

router.put('/:myId', async(req, res) => {    
    // Cerquem la company a la nostra bbdd MongoDB. El paràmetre req.params.myId està a l'url.

    const myCompanyById = await CompanyModel.findByIdAndUpdate(req.params.myId, {
        name: req.body.myName,
        country: req.body.myCountry
    },
    {
        new: true
    })

    /* Si !myCompanyById is TRUE, vol dir que l'objecte és NULL i per tant no l'ha trobat i no s'ha
       de processar. El return de dins de la funció fa que l'execució surti. */

    if (!myCompanyById){
        return res.status(404).send('The COMPANY with ID ' + req.params.myId + ' does not exists!');
    }
    
    /* Codi d'estat 204 és el de: The Server successfully processed the request, 
       but is not returning any content. */

    res.status(204).send('The COMPANY has been updated successfully.');
});

/* DELETE */

router.delete('/:myId', async(req, res) => {    

    const myCompany = await CompanyModel.findByIdAndDelete(req.params.myId);

    if (!myCompany){
        return res.status(404).send('The COMPANY with ID ' + req.params.myId + ' does not exists! So we can not delete it!!');    
    };    

    res.status(200).send('The COMPANY has been deleted successfully.');
})

module.exports = router;