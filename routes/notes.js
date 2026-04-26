const express = require('express')
const router = express.Router()
const Note = require('../models/notes')
const Course = require('../models/courses')
const User = require('../models/users')


router.post('/', async(req, res) => {


    // add into database 
    const data = new Note({
        note: req.body.note,
        evaluation: req.body.evaluation,
        idCourse: req.body.idCourse,
        idStudent: req.body.idStudent
    })
    let err = ''
    let t
    await Note.find({ idCourse: req.body.idCourse, idStudent: req.body.idStudent }).then((docs) => {
        if(docs){
            t = docs
            err = 'note existed'
        }
    })

    
    if (t.length < 1) {
        data.save((error, doc) => {



            if (error) {
                res.json({
                    message: 'Note invalid',

                })
            }
            if (!error) {
                res.json({
                    message: 'Note added',
                })
            }
        })
    }
    else{
        return res.json({
            message : err
        })
    }
}


)

//get all notes
router.get('/', (req, res) => {

    Note.find().populate('idCourse').populate('idStudent').then((docs) => {
        res.json({
            notes: docs
        })
    })

})

//get all notes by teacher
router.get('/byTeacher/:id', (req, res) => {

    Note.find().populate('idCourse').populate('idStudent').then((docs) => {

        const filteredNotes = docs.filter(doc => doc.idCourse.idTeacher == req.params.id)

        res.json({
            notes: filteredNotes
        })

    })


})

//get all notes by child
router.get('/byChild/:id', async (req, res) => {

    User.findOne({ _id: req.params.id }).then((findedUser) => {

        Note.find().populate('idCourse').populate('idStudent').then((notes) => {

            const filteredNotes = notes.filter(doc => doc.idStudent.phone == findedUser.phoneChild)

            return res.json({
                notes: filteredNotes
            })
        })

    })




})

//get all notes by students
router.get('/byStudent/:id', (req, res) => {

    Note.find({ idStudent: req.params.id }).populate('idCourse').populate('idStudent').then((docs) => {

        res.json({
            notes: docs
        })
    })

})


//get all notes by students 2
router.get('/byStudent2/:id', (req, res) => {

    Note.find({ idStudent: req.params.id }).then((docs) => {

        res.json({
            notes: docs
        })
    })

})



//delete course
router.delete('/:id', (req, res) => {

    Note.deleteOne({ _id: req.params.id }).then((docs) => {

        res.json({
            message: 'note deleted'
        })
    })
})

//get note by id
router.get('/:id', (req, res) => {

    Note.findOne({ _id: req.params.id }).then((docs) => {
        return res.json({
            note: docs
        })
    })

})

//update note
router.put('/', (req, res) => {

    const data = new Note({
        _id: req.body._id,
        note: req.body.note,
        evaluation: req.body.evaluation,
        idCourse: req.body.idCourse,
        idStudent: req.body.idStudent

    })

    Note.updateOne({ _id: req.body._id }, data).then(() => {
        return res.json({
            message: 'Note updated'
        })
    })

})




module.exports = router

