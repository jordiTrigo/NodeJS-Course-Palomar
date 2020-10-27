const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/carsdb', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('Connectat correctament a MongoDB.'))
    .catch(() => console.log('Error en la connexió a MongoDB.'));

// Creem un nou schema associat a mongoose:

const carSchema = new mongoose.Schema({
    company: String,
    model: String,
    price: Number,
    year: Number,
    sold: Boolean,
    extras: [String],
    date: {type: Date, default: Date.now}
});

// Ara creem un model (les classes comencen amb majúscules)

const CarModel = mongoose.model('carcollection', carSchema);

// Ara creem un cotxe a dins de la collection carcollection:

//createCar();

// Ara creem una funció asíncrona que ens permetrà inserir un cotxe:

async function createCar(){
    // Creem una instància de la nostra classe Car (no informem el camp date pq l'hem definit a
    // l'esquema com a de tipus date i que per defecte agafa la data actual):

    const myTeslaCar = new CarModel({
        company: 'Kia',
        model: 'Niro',
        price: 30145,
        year: 2021,
        sold: false,
        extras: ['Automatic', 'Electric', 'Beautiful', 'Awesome']
    });

    // El mètode save() guardarà el nostre cotxe myTeslaCar en la collection carCollection a dins
    // de la bbdd de MongoDB anomenada carsdb. La crida al save la fem de manera asíncrona:

    const result = await myTeslaCar.save();
    console.log(result);
};

// Llegim tots els cotxes de la collection carcollection:

//getCars();

async function getCars(){
    const carList = await CarModel.find();
    console.log(carList);
};

// Filtrem les cerques. 

//getCompanyAndSoldFilterCars();

async function getCompanyAndSoldFilterCars(){    
    // Cerquem els cotxes per company='Tesla' and sold=true (no retornarà cap pq el 
    // cotxe company Tesla que hi ha inserit té sold=false):    
    //const carList = await Car.find({company: 'Tesla', sold: true});

    // Cerquem els cotxes per company='Tesla' and sold=false (retornarà 1):    
    const carList = await CarModel.find({company: 'Tesla', sold: false});

    console.log(carList);
};

// Fem més filtres ...

// sort -> Ordena pel(s) camp(s) indicat(s) si fem sort({price: -1}) ordena de manera descendent 
// (de major a menor) i fent sort({price: 1}) ordena de manera ascendent (de menor a major)

// limit -> És com el first del select. Retorna el nombre de registres especificat

// select -> Indica quins són els camps que volem retornar. Si poses 1, vol dir que el retornes, 
// si poses 0, vol dir que NO el retornes. Ex: select({_id: 0, model: 1, company: 1, price: 1, year: 1})
// retornarà de tots els camps disponibles, només model, company, price i year, per defecte sempre retorna
// el camp _id però en aquest cas, com que _id: 0 aleshores NO el retornarà.
// Ex: select({extras: 0, sold: 0}) de tots els camps disponibles, NO retornarà extras ni tampoc sold.

//getMoreFilters();

async function getMoreFilters(){
    const carsList = await CarModel
                        .find({company: 'Kia', sold: false})
                        .sort({price: -1})
                        .limit(2)
                        .select({_id: 0, model: 1, company: 1, price: 1, year: 1});
                        //.select({extras: 0, sold: 0});

    console.log(carsList);
};

// Operadors amb Mongoose:
// $eq -> Igual a
// $ne -> Diferent a
// $gt -> Major estricte que
// $gte -> Major o igual que
// $lt -> Menor estricte que
// $lte -> Menor o igual que

//getCarsByPriceFilter();

async function getCarsByPriceFilter(){
    // Cerca els cotxes tals que price > 30000 and price <= 50000   
    const carList = await CarModel.find({price: {$gt: 30000, $lte: 50000}});

    console.log(carList);
};

// Més operadors. En aquest cas d'arrays:
// $in -> Cerca coincidències amb qualsevol dels valors d'un array que s'hagi especificat.
// $nin -> Cerca que NO hi hagin coincidències amb qualsevol dels valors d'un array que 
// s'hagi especificat

//getCarsByExtrasFilter();

async function getCarsByExtrasFilter(){
    const carList = await CarModel
                    .find({extras: {$nin: 'Hybrid'}});

    console.log(carList);
};

// Més operadors:
// $and -> Aquest operador realitza l'operació lògica "I" en un array d'expressions. Selecciona
// els documents que compleixen TOTES les expressions de l'array.
//
// $or -> Aquest operador realitza l'operació lògica "O" en un array d'expressions. Selecciona
// els documents que compleixen ALMENYS UNA de les expressions de l'array.

//getCarByAndOrFilter();

async function getCarByAndOrFilter(){
    const carList = await CarModel
                    //.find({$and: [{company: 'Tesla'}, {model: 'Model D'}]});
                    //.find({$and: [{extras: {$in: ['Automatic', 'Electric']}}, {year: {$gt: 2019, $lt: 2021}}]});
                    /*.find()
                    .and([{company: 'Kia'}, {model: 'Niro'}, {year: {$gt: 2019, $lte: 2021}}]);*/
                    .find()
                    .or([{company: 'Kia'}, {model: 'Model D'}]);
    
    console.log(carList);
};

//getCarsCount();

async function getCarsCount(){
    const count = await CarModel
                    .find({company: 'Kia'})
                    .count();

    console.log(count);
};

// Paginació amb Mongoose:

//getCarsPagination();

async function getCarsPagination(){
    const pageNumber = 2; // Les pàgines comencen amb 0 fins al (count-1) d'elements
    const pageSize = 2; // Nombre d'elements per pàgina

    const carsList = await CarModel
                        .find()
                        .skip((pageNumber - 1)*pageSize)
                        .limit(pageSize);

    console.log(carsList);
};

// 5f8487e00b3aa0190f5b8a10 és el camp _id del cotxe que volem actualitzar ...
//updateCarById('5f8487e00b3aa0190f5b8a10');

async function updateCarById(id){
    // Primer pas: Cerquem el cotxe:
    
    const myCar = await CarModel.findById(id);

    // !myCar vol dir que no ha retornat res (no ha trobat el car a dins de mongodb). Aleshores
    // no retornem res ...

    if (!myCar) return

    // Si hem arrivat aquí, a la constant myCar tenim el cotxe que cercavem. Ara anem a modificar
    // les dades per actualitzar-les via el mètode save() ...

    myCar.price = 153014;
    myCar.year = 2020;
    
    const result = await myCar.save();

    console.log(result);
};

//updateCarById2('5f8487e00b3aa0190f5b8a10');

async function updateCarById2(id){
    // Mètode 1:
    /*
    const result = await CarModel.update(
        {_id: id},
        {
            $set: {                
                model: 'Niro 2'
            },

            $push: {
                extras: 'Family car'
            }
        }
    );
    */

    // Mètode 2:

    const myCar = await CarModel.findById(id);

    if(!myCar) return

    myCar.model = 'Niro 3';
    myCar.extras.push('Còmode');
    
    const result = await myCar.save();    

    console.log(result);
};

// Esborrar elements de la bbdd MongoDB.

deleteCarById('5f85cfc56d26181bc67acd3e');

async function deleteCarById(aId){
    const result = await CarModel.deleteOne({_id: aId});

    console.log(result);
};
