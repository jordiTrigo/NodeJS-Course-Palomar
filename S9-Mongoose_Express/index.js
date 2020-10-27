const mongoose = require('mongoose');
const express = require('express');
const app = express();

const carRouter = require('./routes/car');
const userRouter = require('./routes/user');
const companyRouter = require('./routes/company');
app.use(express.json()); // El mètode express.json() del paquet express permet parsejar els objectes a JSON
                         // va abans del app.use('/api/cars/', carRouter) SINO POT DONAR ERRORS!!!! 
app.use('/api/cars/', carRouter);   // Això indica que la url base de carRouter és /api/cars/
app.use('/api/users/', userRouter); // Això indica que la url base de userRouter és /api/users/
app.use('/api/company/', companyRouter); // Això indica que la url base de companyRouter és /api/company/

const port = process.env.PORT || 3003;

app.listen(port, ()=>{console.log('Listening on port ' + port)});

mongoose.connect('mongodb://localhost/carsdbfinal', {useNewUrlParser: true, 
                                                     useUnifiedTopology: true, 
                                                     useFindAndModify: false,
                                                     useCreateIndex: true})                                                     
    .then(() => console.log('Connectat correctament a MongoDB.'))
    .catch(() => console.log('Error en la connexió a MongoDB.'));