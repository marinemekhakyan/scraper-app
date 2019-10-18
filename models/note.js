var mongoose = require("mongoose");
//saving a reference to the Schema constructor
var Schema = mongoose.Schema;

//creating a new NoteSchema object using the Schema constructor - similar to the sequelize model
var NoteSchema = new Schema({
    title: String,
    comment: String,
    date: {
        type: Date, default: Date.now
    }
});

//creating the model for above schema using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;