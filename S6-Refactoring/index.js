const express = require('express');
const app = express();

const carRouter = require('./routes/cars');
app.use(express.json()); // El mètode express.json() del paquet express permet parsejar els objectes a JSON
                         // va abans del app.use('/api/cars/', carRouter) SINO POT DONAR ERRORS!!!! 
app.use('/api/cars/', carRouter);  // Això indica que la url base de carRouter és /api/cars/

const port = process.env.PORT || 3003;

app.listen(port, ()=>{console.log('Listening on port ' + port);});