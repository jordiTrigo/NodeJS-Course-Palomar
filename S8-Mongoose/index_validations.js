/* Validacions: https://mongoosejs.com/docs/validation.html 
   Exemple:
    const schema = new Schema({
        name: {
            type: String,
            required: true
            }
    });

    const Cat = db.model('Cat', schema);

    // This cat has no name :(
    const cat = new Cat();
    cat.save(function(error) {
    assert.equal(error.errors['name'].message,
                 'Path `name` is required.');

    error = cat.validateSync();
    assert.equal(error.errors['name'].message,
                 'Path `name` is required.');
}); */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/carsdb2', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('Connectat correctament a MongoDB.'))
    .catch(() => console.log('Error en la connexió a MongoDB.'));

// Creem un nou schema associat a mongoose:

const carSchema = new mongoose.Schema({
    company: {
        type: String,  // És un string 
        required: true, // És un valor requerit 
        //lowercase: true,
        //uppercase: true,
        trim: true, // elimina els espais
        minlength: 2, // ha de tenir mida mínima de 2 caràcters
        maxlength: 99, // ha de tenir mida màxima de 99 caràcters
        enum: ['Kia', 'Tesla']  // els valors possibles són aquests dos
    },
    model: String,
    sold: Boolean,
    price: {
        type: Number,
        required: function(){
            return this.sold
        } // Això vol dir que per saber si és required o no
          // hem de comprovar el que retorna la funció.
          // De manera que, si sold=true => required=true.
          // És a dir que el camp price és requered si i només
          // si, el camp sold=true...
    },
    year: {
        type: Number,
        min: 2000,
        max: 2030,
        get: y => Math.round(y) // el que fa és que si posses un valor 2020'4
                                // el get arrodoneix el valor i posa 2020. 
    },
    extras: [String],
    date: {type: Date, default: Date.now}
});

// Creem el model ...

const CarModel = mongoose.model('carcollection', carSchema);

// Creem cotxes i veurem si passen o no la validació de l'Schema:

createCar();

async function createCar(){
    const myCar = new CarModel({
        company: 'BMW',
        model: 'X7',
        //price: 6000,
        year: 2050,
        sold: true,
        extras: ['4*4', 'Ugly']
    });

    try{
        const result = await myCar.save();
        console.log(result);
    }catch(e){
        console.log(e.message);
    }
    
    
};