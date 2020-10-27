const mongoose = require('mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const saleSchema = new mongoose.Schema({
   user: {            
            type: new mongoose.Schema({
                name: String,
                email: {
                    type: String,
                    trim: true,
                    lowercase: true,
                    unique: true,
                    required: 'Email address is required',
                    validate: [validateEmail, 'Please fill a valid email address'],
                    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
        }),
        required: true
   },
   car: {
            type: new mongoose.Schema({
                    model: String
        }),
        required: true
   },
   price: Number,
   date: {type: Date, default: Date.now}
});

const SaleModel = mongoose.model('salecollection', saleSchema);

module.exports = SaleModel;