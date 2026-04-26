const mongoose = require('mongoose'); 

const CoursSchema = mongoose.Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    duration :{type:String, required : true},
    period :{type:String, required : true},
    idTeacher:{type:String , required : true , ref : 'User'}
    
})

const Cours = mongoose.model('Cours', CoursSchema)

module.exports = Cours
