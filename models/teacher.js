const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const TeacherSchema = new Schema({
    firstname: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String,required: true },
    code: { type: String, required: true },
    subjectname: { type: String, required: true },
    students: [ Number ]
});

TeacherSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

TeacherSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Teacher', TeacherSchema);
