const helpers = {};
const bcrypt = require('bcryptjs');




helpers.encrypPassword = async (password) => { //Para cifrar el password

    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;  // devuelve el password cifrado
};

helpers.matchPassword = async (password, savedPassword) => {

    try {
       return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error)
    }
};


module.exports = helpers;