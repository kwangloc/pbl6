const mongoose = require('mongoose');
const Joi = require("joi"); // for validating req

// const objectIdValidator = Joi.string().custom((value, helpers) => {
//     if (!mongoose.Types.ObjectId.isValid(value)) {
//         return helpers.error('any.invalid');
//     }
//     return value;
// }, 'ObjectId validation');

// module.exports = {objectIdValidator};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

function authUser(req) {
    // joi schema
    const schema = Joi.object({ 
        email: Joi.string().min(2).max(255).required().email(), 
        password: Joi.string().min(6).max(1024).required() // plain password
    });
    return schema.validate(req);;
  }

module.exports = {
    isValidId,
    authUser
};