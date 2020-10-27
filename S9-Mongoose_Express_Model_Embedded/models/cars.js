const mongoose = require('mongoose');
const { companySchema } = require('./company');

/* És equivalent: 

Cas 1) 
const { companySchema } = require('./company');

Cas 2)
const myCompanyModel = require('./company');
const companySchema = myCompanyModel.companySchema;

The two pieces of code are equivalent but the first one is using the ES6 destructuring 
(View: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) 
assignment to be shorter.

Here is a quick example of how it works:

const obj = {
  name: "Fred",
  age: 42,
  id: 1
}

//simple destructuring
const { name } = obj;
console.log("name", name);

//assigning multiple variables at one time
const { age, id } = obj;
console.log("age", age);
console.log("id", id);

//using different names for the properties
const { name: personName } = obj;
console.log("personName", personName);
*/

// Versió amb dades embedded ...

const carSchema = new mongoose.Schema({
    company: {
        type: companySchema,
        required: true
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