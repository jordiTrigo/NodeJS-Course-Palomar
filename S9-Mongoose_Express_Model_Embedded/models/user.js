const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isCostumer: {type: Boolean, default: false},
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },        
    password: {
        type: String,
        required: true
    },
    isAdmin: Boolean,
    role: {type: String, default: 'User'},
    date: {type: Date, default: Date.now}
});

// Creem una funció a nivell d'Schema per utilitzar-la tant a /routes/user.js quan creem un nou usuari
// com a /routes/auth.js quan validem un usuari/password. Com que utilitzavem la mateixa funció en tots
// dos casos, en posar-la aquí la podem reutilitzar. Important: La funció s'ha de definir abans de crear
// el model, és a dir, abans de fer const UserModel = new mongoose.model('usercollection', userSchema);

userSchema.methods.generateJWT = function(){        
    //const mySecret = '3lM31S3cr3tP3rCr34r1nJwtT0k3n';
    //return jwt.sign({_id: this._id, name: this.name}, mySecret);

    // Utilitzem una variable d'entorn que està guardada al fitxer .env 
    return jwt.sign({
        _id: this._id, 
        name: this.name, 
        isAdmin: this.isAdmin,
        role: this.role
    }, 
    process.env.SECRET_KEY_JWT_CAR_API);
};

const UserModel = new mongoose.model('usercollection', userSchema);

module.exports = UserModel;