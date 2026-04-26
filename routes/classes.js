const express = require('express')
const router = express.Router()
const Class = require('../models/classes')

router.post('/add' , (req,res)=>{
    

    // add into database 
        const data = new Class({
            name : req.body.name,
            idCourse : req.body.idCourse,
            idStudent : req.body.students
        })
        data.save((error,doc)=>{
           
           
          
            if(error){
                res.json({
                    message : 'class invalid',
                    
                })
            }
            if(!error){
                res.json({
                    message : 'class added',
                })
            }
        }) 
})


//get all classes
router.get('/' , (req,res)=>{

    Class.find().populate('idCourse').populate('idStudent').then((docs)=>{
        res.json({
            classes : docs
        })
    })
    
})

// delete class
router.delete('/:id', (req,res)=>{

    Class.deleteOne({_id:req.params.id}).then((docs)=>{

        res.json({
            message : 'Class deleted'
        })
    })
})

// get class by id
router.get('/:id' , (req,res)=>{

    Class.findOne({_id:req.params.id}).then((docs)=>{
        return  res.json({
            class : docs
        })
    })
   
})

//update Class
router.put('/', (req, res)=>{
    
    const data = new Class({
        _id:req.body._id,
        name : req.body.name,
        idCourse : req.body.idCourse,
        idStudent : req.body.idStudent
        
    })
    
    Class.updateOne({_id:req.body._id}, data).then( ()=>{
       return res.json({
            message : 'Class updated'
        })
    })
    
})



module.exports = router

