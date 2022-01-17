const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Teacher = require('../models/teacher');
const Subject = require("../models/subject");
const authorize = require("../middlewares/auth");

// Sign-up
router.post("/register-user", (req, res) => {
    Teacher.findOne({ username: req.body.username }, function (err, user) {
        if (err)
            res.status(501).send(err);
        if (user) {
            return res.status(201).send(user);
        } else {
            var newUser = new Teacher();
            newUser.firstname = req.body.firstname;
            newUser.username = req.body.firstname + '.kiet';
            newUser.password = newUser.generateHash(req.body.password);
            newUser.code = req.body.code;
            if (newUser.code == 'RCS087')
                newUser.subjectname = 'Data Compression'
            else if (newUser.code == 'ROE083')
                newUser.subjectname = 'Machine Learning'
            else newUser.subjectname = 'Image Processing'
            newUser.students = [1082925900, 1082925901, 1602913097, 1602913067, 1602913098];
            newUser.save(function (err) {
                if (err)
                    throw err;
                return res.status(200).send(newUser);
            })
        }
    });
});

// Sign-in
router.post("/sign-in", (req, res, next) => {
    let getUser;
    Teacher.findOne({
        username: req.body.username
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Authentication  user  failed"
            });
        }
        getUser = user;
        return user.validPassword(req.body.password);
    }).then(response => {
        if (!response) {
            return res.status(401).json({
                message: "Authentication  password failed"
            });
        }
        let jwtToken = jwt.sign({
            firstname: getUser.firstname,
            userId: getUser._id
        }, "longer-secret-is-better", {
            expiresIn: "30m"
        });
        res.status(200).json({
            token: jwtToken,
            expiresIn: 30 * 60 * 1000,
            _id: getUser._id
        });
    }).catch(err => {
        return res.status(401).json({
            message: "Authentication overall failed"
        });
    });
});

// Get Users
router.route('/').get((req, res) => {
    Teacher.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
})

// Get Single User
router.route('/profile/:id').get(authorize, (req, res, next) => {
    Teacher.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

// Delete Teacher
router.delete('/delete/:id', (req, res) => {
    Teacher.findOneAndRemove(req.params.id, function (err) {
        if (err) console.log(err)
        else res.json({ message: "Teacher is removed!" });
    })
})

// Update Teacher details
router.put('/update/:id', (req, res) => {
    Teacher.findByIdAndUpdate(req.params.id, { firstname: req.body.firstname },
        function (err, doc) {
            if (err)
                console.log("error is")
            else return res.status(200).json({ message: "Teacher data has been updated!" });
        }
    );
})

//Add Question
router.post('/add-question', (req, res) => {
    Subject.findOne({ code: req.body.code }, function (err, subject) {
        if (err)
            return res.status(401).send(err);
        else {
            Subject.findByIdAndUpdate(subject._id,
                { $push: { experiments: { labno: req.body.labno, question: req.body.question } } },
                { new: true },
                function (err, doc) {
                    if (err)
                        console.log("error is")
                    else return res.status(200).send(doc)
                }
            );
        }
    })
})

// Get Questions
router.route('/get-subjects').post((req, res) => {
    Subject.find({ code: req.body.code }, (error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).send(response)
        }
    })
})

// Get Single Subject
router.route('/subject/:id').get(authorize, (req, res, next) => {
    Subject.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

// Get Single Lab
router.route('/lab/:code/:labno').get((req, res, next) => {
    Subject.aggregate([
        { $match: { 'code': req.params.code } },
        {
            $project: {
                experiments: {
                    $filter: {
                        input: '$experiments',
                        as: 'experiments',
                        cond: { $eq: ['$$experiments.labno', parseInt(req.params.labno)] }
                    }
                },
                _id: 0
            }
        }
    ], function (error, doc) {
        if (error)
            return next(error)
        else {
            res.status(200).json({ message: doc[0] })
        }
    });
})

module.exports = router;
