const mongoose = require('mongoose');

/* Versió 1:
const carSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        minlength: 2,
        maxlength: 99,
        enum: ['TESLA', 'KIA', 'BMW', 'MERCEDES', 'AUDI', 'SEAT']
    },
    model: String,
    sold: {type: Boolean, default: true},
    price: {
        type: Number,
        required: function(){
            return this.sold
        }
    },
    year: {
        type: Number,
        min: 2000,
        max: 2030
    },
    extras: [String],
    date: {type: Date, default: Date.now}
});
*/

// Versió 2: Amb dades normalitzades ja que guardem el ObjectId del model COMPANY...

const carSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'companycollection' // Nom de la collection que hi ha a /models/company.js a la part mongoose.model()
    },
    model: String,
    sold: {type: Boolean, default: true},
    price: {
        type: Number,
        required: function(){
            return this.sold
        }
    },
    year: {
        type: Number,
        min: 2000,
        max: 2030
    },
    extras: [String],
    date: {type: Date, default: Date.now}
});

const CarModel = mongoose.model('carcollection', carSchema);

module.exports = CarModel;