const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    firstname: { type: String, required: true },
    username: { type: Number, unique: true, required: true },
    password: { type: String, required: true },
    subjects: [{ subjname: String, subjcode: String }],
    experiments: [{ labno: Number, file: String, code: String }]
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
