const express = require('express')
const router = express.Router()
const Course = require('../models/courses')
const Class = require('../models/classes')

router.post('/add' , (req,res)=>{
    

    // add into database 
        const data = new Course({
            name : req.body.name,
            description : req.body.description,
            duration : req.body.duration,
            period : req.body.period,
            idTeacher : req.body.idTeacher
        })
        data.save((error,doc)=>{
           
           
            console.log('dec equal : ',doc)
            if(error){
                res.json({
                    message : 'course invalid',
                    
                })
            }
            if(!error){
                res.json({
                    message : 'course added',
                })
            }
        }) 
})

//get all courses
router.get('/' , (req,res)=>{

    Course.find().populate('idTeacher').then((docs)=>{
        res.json({
            courses : docs
        })
    })
    
})

//get all courses by teacher id
router.get('/:id' , (req,res)=>{
    console.log(req.params.id)
    Course.find( {idTeacher : req.params.id }).populate('idTeacher').then((docs)=>{
        res.json({
            courses : docs
        })
    })
    
})


// get cours by id
router.get('/course/:id' , (req,res)=>{

    Course.findOne({_id:req.params.id}).then((docs)=>{
        return  res.json({
            cours : docs
        })
    })
   
})

// get cours by student id
router.get('/byStudent/:id' , (req,res)=>{

    Class.find( {idStudent : req.params.id} ).populate('idStudent').populate('idCourse').then((findedClasses)=>{
        
        const r=[]
        for (let i = 0; i < findedClasses.length; i++) {
            r.push(findedClasses[i].idCourse._id)
            
        }


        Course.find( {_id : {$in : r    }}).populate('idTeacher').then((docs)=>{
            
            return res.json({
                courses : docs
            })
        })
    })
    

})

//delete course
router.delete('/:id', (req,res)=>{

    Course.deleteOne({_id:req.params.id}).then((docs)=>{

        res.json({
            message : 'Cours deleted'
        })
    })
})

//update course
router.put('/:id', (req, res)=>{
    
    const data = new Course({
        _id:req.body._id,
        name :req.body.name,
        description :req.body.description,
        duration :req.body.duration,
        period : req.body.period,
        idTeacher:req.body.idTeacher
    })
    
    Course.updateOne({_id:req.body._id}, data).then( ()=>{
       return res.json({
            message : 'Course updated'
        })
    })
    
})






module.exports = router
