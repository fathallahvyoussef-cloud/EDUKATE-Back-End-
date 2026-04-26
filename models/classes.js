const mongoose = require('mongoose'); 

const ClassSchema = mongoose.Schema({
    name:{type:String, required:true},
    idCourse : {type:String , required : true, ref : 'Cours'},
    idStudent : [{type : String , required : true, ref:'User'}]
    
    
})

const Class = mongoose.model('Class', ClassSchema)

module.exports = Class
