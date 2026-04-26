const express = require('express')
const router = express.Router()
const User = require('../models/users')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const multer = require('multer')

const upload =multer({dest : 'images/'})

const MIME_TYPE = {
    'image/png' : 'png',
    'image/jpeg' : 'jpeg',
    'image/jpg' : 'jpg'
}

    const storage = multer.diskStorage({
    // destination
    destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype];
    let error = new Error("Mime type is invalid");
    if (isValid) {
    error = null
    }
    cb(null, 'images')
    },
    filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE[file.mimetype];
    const imgName = name + '-' + Date.now() + '-EDUKATE-' + '.' + 
    extension;
    cb(null, imgName);
    }
    });



router.post('/inscri' ,multer({storage : storage}).single('image')  , async (req,res)=>{
    
    
const password = await bcrypt.hash(req.body.password, 10)

let url = req.protocol + '://' + req.get('host');
let image

if(req.body.role != 'admin'){
  image= url + '/images/' + req.file.filename
}

// add into database 
const data = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone : req.body.phone,
    phoneChild:req.body.phoneChild,
    password: password,
    adresse:req.body.adresse,
    speciality:req.body.speciality,
    status : req.body.status,
    role: req.body.role,
    image : image
})

let err = false
let msg = ''

// in case of parent inscription 
if( req.body.role == 'parent' ){
    await User.find({
        $and: [
          { role : 'student' },
          { phone : req.body.phoneChild }
        ]
      } ).then(async (findedItems)=>{ 
            
            if( findedItems.length == 0 ){

                err = true
                msg = 'child phone N° does not exist'
            }
            else{
                
                await User.find( {role : 'parent', phoneChild : req.body.phoneChild } ).then((docs)=>{
                    
                    if(docs.length > 0){
                        
                        err = true
                        msg = 'child phone N° assigned to another parent'
                    }
                })
            }
            
    })

}
    


if(err == false){
    
    data.save((error, doc) => {

        if (error) {
            return res.json({
                message: 'invalid inscription'
            })
        }
        if (!error) {
            
            return res.json({
                message: req.body.role + ' added',
            })
        }
    })
}
else{
    return res.json({
        message : msg
    })
}

})

router.post('/login', async (req, res) => {

    const { phone, password } = req.body
    const user = await User.findOne({ phone: phone })
    if (!user) {
        return res.status(200).json({ message: 0 })
    }
    const trusted = await bcrypt.compare(password, user.password)
    if (!trusted) {
        return res.status(200).json({ message: 1 })
    }
    if(user.status == 'invalid'){
        return res.status(200).json({ message: -1 }) 
    }
    
    const token = await jwt.sign({ username: `${user.firstName} ${user.lastName}`, id: user._id, role : user.role  }, 'EDUKATE')
    return res.status(200).json({ message: 2, token: token, role : user.role })


})


// get All students
router.get('/students' , (req,res)=>{
    
    User.find( { role : 'student'} ).then((docs)=>{
        res.json({
            users : docs
        })
    })
    
})

// get All users
router.get('/' , (req,res)=>{
    
    User.find( { role : { $ne :  'admin' } ,status : 'valid' }).then((docs)=>{
        res.json({
            users : docs
        })
    })
    
})


// get teachers not valid
router.get('/teachers' , (req,res)=>{
    
    User.find( { role : 'teacher', status : 'invalid'} ).then((docs)=>{
        res.json({
            users : docs
        })
    })
    
})

// validate Teacher
router.put('/validate/:id', (req,res)=>{
    
    User.findOne({_id:req.params.id}).then((findedUser)=>{
        
        findedUser.updateOne({_id:req.params.id},{set : {status : 'valid' }}).then( ()=>{
            return res.json({
                 message : 'Teacher Validated'
             })
    })

} )

})

//delete user
router.delete('/:id', (req,res)=>{

    User.deleteOne({_id:req.params.id}).then((docs)=>{

        res.json({
            message : 'User deleted'
        })
    })
})
    


module.exports = router

