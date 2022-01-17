const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    experiments: [{ labno: Number, question: String }]
});

module.exports = mongoose.model('Subject', SubjectSchema);
