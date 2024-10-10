const Joi = require("joi");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // json web token
const config = require('config'); // configurations
const { objectIdValidator } = require('../validations/validators'); // To check objectId of sub document

// DB schema
const jobSchema = mongoose.Schema({
    id: Joi.string().hex().length(24),
    title: {
        type: String,
        required: true
    },
    due: {
        type: Date,
        required: true
    }
})

const skillSchema = mongoose.Schema({
    id: Joi.string().hex().length(24),
    title: {
        type: String,
        required: true
    }
})

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlengh: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlengh: 1024 // hash password
    },
    location: {
        type: String,
        require: true
    },
    skills: {
        type: [skillSchema],
    },
    experience: {
        type: Array,
    },
    education: {
        type: Array,
    },
    savedJobs: {
        type: [jobSchema]
    },
    appliedJobs: {
        type: [jobSchema]
    }
});

// gen jwt
// userSchema.methods.generateAuthToken = function() {
//     const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
//     return token;
// }

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, name: this.name, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

// model
const User = new mongoose.model('User', userSchema);

// Functions
function validateUser(rental) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        password: Joi.string().min(6).max(1024).required(),
        email: Joi.string().min(2).max(255).required().email(), // plain password
        location: Joi.string().min(1).required()
    });
    return schema.validate(rental);;
}

module.exports = {
    userSchema,
    User,
    validateUser
};