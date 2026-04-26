const mongoose = require('mongoose'); 

const NoteSchema = mongoose.Schema({
    note:{type:Number, required:true},
    evaluation:{type:String, required:true},
    idCourse:{type:String, required : true , ref : 'Cours'},
    idStudent:{type:String , required : true , ref : 'User'}
    
})

const Notes = mongoose.model('Notes', NoteSchema)

module.exports = Notes
