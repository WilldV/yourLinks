const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema;
const linkSchema = new Schema({
    idUsuario: { type: ObjectId },
    nombre: { type: String },
    direccion: { type: String }
})

module.exports = mongoose.model('Link', linkSchema);