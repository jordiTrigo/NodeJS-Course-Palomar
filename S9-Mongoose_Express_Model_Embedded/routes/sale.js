const verifyAuth = require('../middleware/auth');
const admin = require('../middleware/admin')
const express = require('express');
const SaleModel = require('../models/sale');
const UserModel = require('../models/user');
const CarModel = require('../models/cars');
const mongoose = require('mongoose');

const router = express.Router();

// La part [verifyAuth, admin] és la dels middlewares. Per poder accedir al get primer passa pels
// middlewares i ha de complir 
// 1) verifyAuth -> ../middleware/auth.js
// 2) admin -> ../middleware/admin.js

router.get('/', [verifyAuth, admin], async(req, res) => {
    const saleList = await SaleModel.find();
    res.send(saleList);
});

router.post('/', verifyAuth, async(req, res) => {
    const myUser = await UserModel.findById(req.body.myUserId);
    if (!myUser) return res.status(400).send('User with id ' + req.body.myUserId + ' does not exists!');

    const myCar = await CarModel.findById(req.body.myCarId);
    if (!myCar) return res.status(400).send('Car with id ' + req.body.myCarId + ' does not exists!');

    if (myCar.sold === true) return res.status(400).send('This car has been already sold!');

    // Si hem arribat aquí vol dir que l'usuari existeix, el cotxe existeix i a més, el cotxe no ha estat
    // venut, per tant, el podem vendre ....

    const mySale = new SaleModel({
        user: {
            _id: myUser._id,
            name: myUser.name,
            email: myUser.email
        },
        car: {
            _id: myCar._id,
            model: myCar.model
        },
        price: req.body.myPrice
    });

    /********** Sense Transactions *********

    // Guardem a MongoDB la venda del cotxe per l'usuari ...

    const result = await mySale.save();

    // Aquest usuari ara és un costumer, per tant, isCostumer = true ...

    myUser.isCostumer = true;
    myUser.save();

    // El cotxe ja ha estat venut ...

    myCar.sold = true;
    myCar.save();

    ********* Fi Sense Transactions **********/

    // Transactions amb mongoose (https://mongoosejs.com/docs/transactions.html).
    // Transactions let you execute multiple operations in isolation and potentially 
    // undo all the operations if one of them fails.
    // Creem una constants session i executar session.startTransaction()...

    const session = await mongoose.startSession();  
    session.startTransaction();
    try{
        // Guardem a MongoDB la venda del cotxe per l'usuari ...

        const result = await mySale.save();

        // Aquest usuari ara és un costumer, per tant, isCostumer = true ...

        myUser.isCostumer = true;
        myUser.save();

        // El cotxe ja ha estat venut ...

        myCar.sold = true;
        myCar.save();

        await session.commitTransaction();
        session.endSession();

        res.status(201).send(result);
    }catch(e){
        await session.abortTransaction();
        session.endSession();
        res.status(500).send('Sale cannot be saved to db. Error: ' + e.message);
    };    
});

module.exports = router;