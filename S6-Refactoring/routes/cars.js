const express = require('express');
//const router = express();
const router = express.Router();
/* Paquet express-validator: 
   https://express-validator.github.io/docs/index.html
   https://github.com/validatorjs/validator.js#validators
   https://www.freecodecamp.org/news/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7/ */

const { body, validationResult } = require('express-validator');

/* Llista de cotxes en un array (més endavant en una bbdd mongodb) */

let carsList = [
    {id: 0, company: 'BMW', model: 'X3', year: '2020'},
    {id: 1, company: 'AUDI', model: 'A1', year: '2022'},
    {id: 2, company: 'Mercedes', model: 'Clase A', year: '2025'},
    {id: 3, company: 'Kia', model: 'Niro', year: '2050'}
];

/* Mètodes GET */

router.get('/list', (req, res) => {
    res.send(['BMW S1', 'AUDI 4', 'Mercedes Clase A', 'Kia Niro']);
})

/* Obtenir paràmetres de l'URL amb GET */

/* 1) Escriure el paràmetre que enviem per request (req) */

router.get('/id/:myId', (req, res) => {
    res.send(req.params.myId);
})

/* 2) Paràmetres per URL */

router.get('/:company/:model', (req, res) => {
    //res.send(req.params.company);
    //res.send(req.params.model);

    // Retorna tots els paràmetres com un objecte ...
    res.send(req.params);
})

/* Mostrar la llista de cotxes guardats a l'array */

router.get('/', (req, res) => {
    res.send(carsList);
})

/* Cerquem els cotxes de l'array carsList a on company = :myCompany*/

router.get('/:myCompany', (req, res) => {
    const carFound = carsList.find(car => car.company.toLowerCase === req.params.myCompany.toLowerCase);

    /* Si !myCarById is TRUE, vol dir que l'objecte és NULL i per tant no l'ha trobat i no s'ha
       de processar. El return de dins de la funció fa que l'execució surti. */

    if (!carFound){
        res.status(404).send('No car found for this company!');        
    }else{
        res.send(carFound);
    }
})

/* Mètode POST */

router.post('/', (req, res) => {
    let carId = carsList.length;

    let myCar = {
        id: carId,
        company: req.body.myCompany,
        model: req.body.myModel,
        year: req.body.myYear
    };

    /* Afegim amb el mètode push el nou cotxe al nostre array de cotxes carsList.
       Més endavant aquí guardarem en una bbdd aquest nou cotxe. */
       
    carsList.push(myCar);

    /* Codi d'estat 201 és el de CREATED */

    res.status(201).send(myCar);
});

/* POST amb validacions. Canviem l'endpoint a 2/ per distingir-lo. En el cas de POST
   els paràmetres els estem passant a través del BODY, no de l'url. Per això utilitzem 
   req.body.myCompany, req.body.myModel, req.body.myYear */

router.post('/2', (req, res) => {
    
    if(!req.body.myCompany || req.body.myCompany.length < 3){

        /* El codi d'estat 400 és un Bad Request */
        res.status(400).send('The field company is required!');

        /* En el moment que fem un return sortim de la funció
           ie, les linies següents no es processaran. */
        return
    }
    
    let carId = carsList.length;

    let myCar = {
        id: carId,
        company: req.body.myCompany,
        model: req.body.myModel,
        year: req.body.myYear
    };

    /* Afegim amb el mètode push el nou cotxe al nostre array de cotxes carsList.
       Més endavant aquí guardarem en una bbdd aquest nou cotxe. */
       
    carsList.push(myCar);

    /* Codi d'estat 201 és el de CREATED */

    res.status(201).send(myCar);
});

/* POST amb express-validator. Canviem l'endpoint a 3/ per distingir-lo. En el cas de POST
   els paràmetres els estem passant a través del BODY, no de l'url. Per això utilitzem 
   req.body.myCompany, req.body.myModel, req.body.myYear */

router.post('/3', [
    // myCompany must be at least 4 chars long
    body('myCompany').isLength({ min: 4 }),
    // myModel must be at least 1 char long
    body('myModel').isLength({ min: 1 }),
    // myModel must be at least 1 char long
    body('myYear').isInt({ min: 2000, max: 3000 } )
  ],(req, res) => {    

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      /* Si passa per aquest return, surt de la funció */

      return res.status(400).json({ errors: errors.array() });
    };
    
    /* Creem el cotxe */

    let carId = carsList.length;

    let myCar = {
        id: carId,
        company: req.body.myCompany,
        model: req.body.myModel,
        year: req.body.myYear
    };

    /* Afegim amb el mètode push el nou cotxe al nostre array de cotxes carsList.
       Més endavant aquí guardarem en una bbdd aquest nou cotxe. */
       
    carsList.push(myCar);

    /* Codi d'estat 201 és el de CREATED */

    res.status(201).send(myCar);
});

/* PUT amb express-validator. Canviem l'endpoint a /::myId. En el cas de PUT
   els paràmetres els estem passant a través de l'URL, no del BODY. Per això utilitzem
   req.params.myId */

router.put('/:myId', [
    // myCompany must be at least 4 chars long
    body('myCompany').isLength({ min: 4 }),
    // myModel must be at least 1 char long
    body('myModel').isLength({ min: 1 }),
    // myModel must be at least 1 char long
    body('myYear').isInt({ min: 2000, max: 3000 } )
  ],(req, res) => {    

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      /* Si passa per aquest return, surt de la funció */

      return res.status(400).json({ errors: errors.array() });
    };
    
    /* Cerquem el cotxe a dins l'array amb el mètode find. El paràmetre req.params.myId 
       és un string i currentCar.id és un integer, per això utilitzem el mètode parseInt 
       que converteix un string en un integer */

    const myCarById = carsList.find(currentCar => currentCar.id === parseInt(req.params.myId));

    /* Si !myCarById is TRUE, vol dir que l'objecte és NULL i per tant no l'ha trobat i no s'ha
       de processar. El return de dins de la funció fa que l'execució surti. */

    if (!myCarById){
        return res.status(404).send('The car with ID ' + req.params.myId + ' does not exists!');
    }
    
    /* Actualitzem el cotxe a través de les dades que ens passen pel BODY */

    myCarById.company = req.body.myCompany;
    myCarById.model = req.body.myModel;
    myCarById.year = req.body.myYear;    

    /* Codi d'estat 204 és el de The Server successfully processed the request, 
       but is not returning any content. */

    res.status(204).send('The car has been updated successfully.');
});

/* DELETE */

router.delete('/:myId', (req, res) => {

    /* The findIndex() method returns the index of the first element in the array that 
       satisfies the provided testing function. Otherwise -1 is returned. */

    const carIndex = carsList.findIndex(currentCar => currentCar.id === parseInt(req.params.myId));

    if (carIndex === -1){
        return res.status(404).send('The car with ID ' + req.params.myId + ' does not exists! So we can not delete it!!');    
    };

    /* Mètode array.splice(start[, deleteCount[, item1[, item2[, ...]]]]) per eliminar i inserir 
       elements a l'array */

    carsList.splice(carIndex, 1);

    res.status(200).send('The car has been deleted successfully.');
})

module.exports = router;