const mongoose = require('mongoose'); 

const UserSchema = mongoose.Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    email:{type:String, required:true , unique : true},
    phone:{type:String, required:true, unique : true},
    phoneChild:{type:String,},
    password:{type:String, required:true},
    adresse:{type:String, required:true},
    speciality:{type:String},
    status:{type:String, required:true},
    role:{type:String, required:true},
    //CV
    image:{type:String } 

},{timestamps : true})

const User = mongoose.model('User', UserSchema)

module.exports = User
