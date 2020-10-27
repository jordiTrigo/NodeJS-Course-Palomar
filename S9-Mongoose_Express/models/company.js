const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 99
    },
    country: String,
    date: {type: Date, default: Date.now}
});

const CompanyModel = mongoose.model('companycollection', companySchema);

module.exports = CompanyModel;